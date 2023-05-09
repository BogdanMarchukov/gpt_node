import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import { User } from '../../models/User.model';
import { UserChat } from '../../models/UserChat';
import { Message } from '../../common/types';
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

  async createChat(user: User, startMessage: string) {
    const { data } = await this.openai.createChatCompletion({
      model: this.configService.get<string>('gpt.model'),
      messages: [{ role: 'user', content: startMessage }],
    });
    const userChat = await UserChat.create({
      userId: user.id,
      object: data.object,
      model: data.model,
      usage: data.usage,
      message: data.choices.map((c) => c.message as Message),
    });

    return userChat;
  }
}
