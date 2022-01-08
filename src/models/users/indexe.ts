/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import User from './user';
import Item from '../items/global';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';

export type UserIndexeModel = BaseEntity<{
  //? Columns
  id: string;
  quality: number;

  //? Foreign Keys
  user_id: string;
  item_id: string;

  //? Others models
  item: Item;
}>;

@Table({ tableName: 'indexes', schema: 'users' })
export default class UserIndexe extends Model implements UserIndexeModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(2, 1) })
  declare quality: number;

  //? Foreign Keys
  @ForeignKey(() => User)
  @Column({ type: DataType.STRING })
  declare user_id: string;

  @ForeignKey(() => Item)
  @Column({ type: DataType.STRING })
  declare item_id: string;

  //? Others models
  @BelongsTo(() => Item, { foreignKey: 'item_id' })
  declare item: Item;
}
