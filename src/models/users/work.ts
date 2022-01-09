/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import User from './user';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, ForeignKey } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';
import { UserWorkType } from '../../structures/typings/database';

export type UserWorkModel = BaseEntity<{
  //? Columns
  id: string;
  type: UserWorkType;
  level: number;
  points: number;
  cooldown: number;

  //? Foreign keys
  user_id: string;
}>;

@Table({ tableName: 'indexes', schema: 'users' })
export default class UserWork extends Model implements UserWorkModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare type: UserWorkType;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare level: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare points: number;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare cooldown: number;

  //? Foreign keys
  @ForeignKey(() => User)
  declare user_id: string;
}
