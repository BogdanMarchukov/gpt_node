import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import { User } from '../../models/User.model';
import { UserChat } from '../../models/UserChat';
import { Message } from '../../common/types';
import { from, timeout, retry } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Gpt, RootKeys } from 'src/common/config-types';
@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {}

  private readonly configuration = new Configuration({
    apiKey: this.configService.get<Gpt>(RootKeys.Gpt).key,
  });
  private readonly openai = new OpenAIApi(this.configuration);

  async createChat(
    user: User,
    startMessage: string,
  ): Promise<UserChat | Error> {
    return new Promise((resolve, reject) => {
      const subscribeOpenApi = from(
        this.openai.createChatCompletion({
          model: this.configService.get<Gpt>(RootKeys.Gpt).model,
          messages: [{ role: 'user', content: startMessage }],
        }),
      );
      subscribeOpenApi.pipe(timeout(10000), retry(2)).subscribe({
        next: async (axiosResponse) => {
          const { data } = axiosResponse;
          const userChat = await UserChat.create({
            userId: user.id,
            object: data.object,
            model: data.model,
            usage: data.usage,
            message: data.choices.map((c) => c.message as Message),
          });
          resolve(userChat);
        },
        error: (error) => reject(new RpcException(error.message)),
      });
    });
  }

  async replayChat(
    message: Message,
    chatId: string,
  ): Promise<UserChat | Error> {
    return new Promise(async (resolve, reject) => {
      const userChat = await UserChat.findByPk(chatId);
      if (!userChat) {
        reject(new RpcException('user chat not foud'));
      }

      const subscribeOpenApi = from(
        this.openai.createChatCompletion({
          model: this.configService.get<Gpt>(RootKeys.Gpt).model,
          messages: this.validateMessage([...userChat.message, message]),
        }),
      );
      subscribeOpenApi.subscribe({
        next: async (axiosResponse) => {
          const { data } = axiosResponse;
          await userChat.update({
            usage: data.usage,
            message: [
              ...userChat.message,
              message,
              ...data.choices.map((c) => c.message as Message),
            ],
          });
          resolve(userChat);
        },
        error: (error) => reject(new RpcException(error.message)),
      });
    });
  }

  private validateMessage(message: Message[]) {
    let contentLength = 0;
    message.forEach((m) => {
      contentLength = contentLength + m.content.length;
    });
    if (contentLength > 10000) {
      message.shift();
      return this.validateMessage(message);
    } else {
      return message;
    }
  }
}
