import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetUser } from '../user/user.decorator';
import { User } from '../../models/User.model';
import { GptService } from './gpt.service';
import { ExceptionFilter } from 'src/common/exception/rpc-exception.filter';
import { CreateChatDto } from './dto/create-chat.dto';
import { ContinueChatDto } from './dto/continue-chat.dto';

@UseFilters(new ExceptionFilter())
@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @UseFilters(new ExceptionFilter())
  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern('createChat')
  async createChat(@Payload() data: CreateChatDto, @GetUser() user: User) {
    return await this.gptService.createChat(user, data.startMessage);
  }

  @UseFilters(new ExceptionFilter())
  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern('continueChat')
  async replyToActiveChat(@Payload() data: ContinueChatDto) {
    return await this.gptService.replayChat(data.message, data.activeChatId);
  }
}
