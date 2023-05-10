import {
  Column,
  DataType,
  ForeignKey,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from './Base.model';
import { Message, Usage } from '../common/types';
import { User } from './User.model';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
@Exclude()
@Table({ tableName: 'userChats', modelName: 'userChat' })
export class UserChat extends BaseModel<UserChat> {
  @Column
  @Expose()
  object: string;

  @Column
  @Expose()
  model: string;

  @Column(DataType.JSONB)
  @Expose()
  usage: Usage;

  @Column(DataType.JSONB)
  @Expose()
  message: Message[];

  @BelongsTo(() => User, 'userId')
  user: User;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;
}
