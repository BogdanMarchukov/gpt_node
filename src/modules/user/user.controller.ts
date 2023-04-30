import { Controller, UnauthorizedException } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class UserController {
  @MessagePattern('user')
  async userCreate(@Payload() data: string, @Ctx() context: RmqContext) {
    console.log(data);
    return { error: false };
  }
  @EventPattern('createdd')
  async hello(data: string) {
    console.log(data);
  }
}
