/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';

/* */
export type EventModel = BaseEntity<{
  //? Columns
  id: string;
  name: string;
  description: string;
  slug: string;
}>;

@Table({ tableName: 'events', schema: 'others' })
export default class Event extends Model implements EventModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(64) })
  declare name: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  declare description: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(64) })
  declare slug: string;
}
