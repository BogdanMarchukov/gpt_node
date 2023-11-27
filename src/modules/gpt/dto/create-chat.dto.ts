import { IsString, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsUUID()
  commonId: string;

  @IsString()
  startMessage: string;
}
