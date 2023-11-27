import { Type } from 'class-transformer';
import { IsEnum, IsString, IsUUID, ValidateNested } from 'class-validator';
import { RoleType } from 'src/common/types';

class MessageDto {
  @IsEnum(RoleType)
  role: RoleType;

  @IsString()
  content: string;
}

export class ContinueChatDto {
  @IsUUID()
  commonId: string;

  @IsUUID()
  activeChatId: string;

  @ValidateNested()
  @Type(() => MessageDto)
  message: MessageDto;
}
