import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChatPayload } from '../../common/types';
import { GetUser } from '../user/user.decorator';
import { User } from '../../models/User.model';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern('createChat')
  async createChat(@Payload() data: CreateChatPayload, @GetUser() user: User) {
    try {
      return await this.gptService.createChat(user, data.startMessage);
    } catch (e) {
      return { error: true };
      // TODO create - ExceptionFilter
    }
  }
}
