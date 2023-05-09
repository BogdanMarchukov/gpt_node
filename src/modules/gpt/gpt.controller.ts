import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChatPayload } from '../../common/types';
import { GetUser } from '../user/user.decorator';
import { User } from '../../models/User.model';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}
  @MessagePattern('createChat')
  async createChat(@Payload() data: CreateChatPayload, @GetUser() user: User) {
    try {
      const userChat = await this.gptService.createChat(
        user,
        data.startMessage,
      );
      return userChat.message;
    } catch (e) {
      // TODO create - ExceptionFilter
    }
  }
}
