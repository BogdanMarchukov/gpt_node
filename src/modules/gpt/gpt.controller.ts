import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateChatPayload } from '../../common/types';
import { GetUser } from '../user/user.decorator';
import { User } from '../../models/User.model';

@Controller('gpt')
export class GptController {
  @MessagePattern('createChat')
  async createChat(@Payload() data: CreateChatPayload, @GetUser() user: User) {
    console.log(user, 'user');
    console.log(data, 'data');
    return { error: false };
  }
}
