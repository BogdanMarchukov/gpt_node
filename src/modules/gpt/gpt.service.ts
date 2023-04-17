import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {}
  async testGpt() {
    const configuration = new Configuration({
      apiKey: this.configService.get<string>('gpt.key'),
    });
    const openai = new OpenAIApi(configuration);
     // openai.createChatCompletion({});
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Say this is a test',
      temperature: 0,
      max_tokens: 7,
    });
  }
}
