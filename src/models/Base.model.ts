import {
  Column,
  CreatedAt,
  DataType,
  Default,
  IsUUID,
  Model,
  PrimaryKey,
  UpdatedAt,
} from 'sequelize-typescript';
import {Expose} from "class-transformer";

export class BaseModel<T> extends Model<T> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @Expose()
  id: string;
  @Column
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
