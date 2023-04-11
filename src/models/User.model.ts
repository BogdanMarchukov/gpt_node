import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from './Base.model';

@Table({ tableName: 'users', modelName: 'user' })
export class User extends BaseModel<User> {
  @Column
  userName: string;
}
