import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChatPayload, ReplayActiveChat } from '../../common/types';
import { GetUser } from '../user/user.decorator';
import { User } from '../../models/User.model';
import { GptService } from './gpt.service';
import { ExceptionFilter } from 'src/common/exception/rpc-exception.filter';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @UseFilters(new ExceptionFilter())
  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern('createChat')
  async createChat(@Payload() data: CreateChatPayload, @GetUser() user: User) {
    return await this.gptService.createChat(user, data.startMessage);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern('continueChat')
  async replyToActiveChat(@Payload() data: ReplayActiveChat) {
    return await this.gptService.replayChat(data.message, data.activeChatId);
  }
}
