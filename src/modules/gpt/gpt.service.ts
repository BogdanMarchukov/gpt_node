import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import { User } from '../../models/User.model';
import { UserChat } from '../../models/UserChat';
import { Message } from '../../common/types';
import { from, catchError, timeout, retry } from 'rxjs';
@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {}
  private readonly configuration = new Configuration({
    apiKey: this.configService.get<string>('gpt.key'),
  });
  private readonly openai = new OpenAIApi(this.configuration);
  async testGpt() {
    // openai.createChatCompletion({});
    const response = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Say this is a test',
      temperature: 0,
      max_tokens: 7,
    });
  }

  async createChat(
    user: User,
    startMessage: string,
  ): Promise<UserChat | Error> {
    return new Promise((resolve, reject) => {
      const subscribeOpenApi = from(
        this.openai.createChatCompletion({
          model: this.configService.get<string>('gpt.model'),
          messages: [{ role: 'user', content: startMessage }],
        }),
      );
      subscribeOpenApi.pipe(timeout(5000), retry(2)).subscribe({
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
        error: (error) => reject(error),
      });
    });
  }

  async replayChat(
    user: User,
    message: Message,
    chatId: string,
  ): Promise<UserChat | Error> {
    return new Promise(async (resolve, reject) => {
      const userChat = await UserChat.findByPk(chatId);
      if (!userChat) {
        reject(new Error());
      }

      const subscribeOpenApi = from(
        this.openai.createChatCompletion({
          model: this.configService.get<string>('gpt.model'),
          messages: [...userChat.message, message],
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
        error: (error) => reject(error),
      });
    });
  }
}
