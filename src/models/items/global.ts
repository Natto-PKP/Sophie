/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import Event from '../others/events';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';
import { ItemType } from 'src/structures/typings/database';

export type ItemModel = BaseEntity<{
  //? Columns
  id: string;
  type: ItemType;
  name: string;
  slug: string;
  description: string;
  tickets: number;
  golds: number;

  //? Foreign keys
  event_id: string;

  //? Others models
  event: Event;
}>;

@Table({ tableName: 'global', schema: 'items' })
export default class Item extends Model implements ItemModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(32) })
  declare type: ItemType;

  @AllowNull(false)
  @Column({ type: DataType.STRING(64) })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(64) })
  declare slug: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  declare description: string;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare tickets: number;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare golds: number;

  //? Foreign keys
  @ForeignKey(() => Event)
  @Column({ type: DataType.STRING })
  declare event_id: string;

  //? Others models
  @BelongsTo(() => Event, { foreignKey: 'event_id' })
  declare event: Event;
}
