import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './Base.model';
import { Message, Usage } from '../common/types';
import { User } from './User.model';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Table({ tableName: 'userChats', modelName: 'userChat' })
export class UserChat extends BaseModel<UserChat> {
  @Column
  object: string;

  @Column
  model: string;

  @Column(DataType.JSONB)
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
