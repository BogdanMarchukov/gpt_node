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

@Table({ tableName: 'userChats', modelName: 'userChat' })
export class UserChat extends BaseModel<UserChat> {
  @Column
  object: string;

  @Column
  model: string;

  @Column(DataType.JSONB)
  usage: Usage;

  @Column(DataType.JSONB)
  message: Message;

  @BelongsTo(() => User, 'userId')
  user: User;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;
}
