import { createParamDecorator } from '@nestjs/common';
import { User } from '../../models/User.model';

export const GetUser = createParamDecorator(async (_, ctx: any) => {
  const data = ctx.args[0];
  let user;
  user = await User.findOne({
    where: {
      commonId: data.commonId,
    },
  });
  if (!user) {
    user = await User.create({
      commonId: data.commonId,
      userName: data.userName,
    });
  }
  return user;
});
