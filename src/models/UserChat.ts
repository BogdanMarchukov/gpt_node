import {
  Column,
  DataType,
  ForeignKey,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from './Base.model';
import { Message, Usage } from '../common/types';

@Table({ tableName: 'userChats', modelName: 'userChat' })
export class User extends BaseModel<User> {
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
