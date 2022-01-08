/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import User from './user';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, ForeignKey } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';

export type UserEconomieModel = BaseEntity<{
  //? Columns
  id: string;
  tickets: number;
  golds: number;

  //? Foreign Keys
  user_id: string;
}>;

@Table({ tableName: 'economies', schema: 'users' })
export default class UserEconomie extends Model implements UserEconomieModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare tickets: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare golds: number;

  //? Foreign Keys
  @ForeignKey(() => User)
  @Column({ type: DataType.STRING })
  declare user_id: string;
}
