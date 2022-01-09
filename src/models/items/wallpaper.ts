/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import Event from '../others/events';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';
import { WallpaperType } from 'src/structures/typings/database';

/* */
export type ItemWallpaperModel = BaseEntity<{
  //? Columns
  id: string;
  name: string;
  slug: string;
  description: string;
  character: string;
  primary_color: string;
  accent_color: string;
  tickets: number;
  golds: number;
  tags: bigint;
  type: WallpaperType;

  //? Foreign keys
  event_id: string;

  //? Others models
  event: Event;
}>;

@Table({ tableName: 'wallpapers', schema: 'items' })
export default class ItemWallpaper extends Model implements ItemWallpaperModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

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
  @Column({ type: DataType.STRING })
  declare character: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(7) })
  declare primary_color: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(7) })
  declare accent_color: string;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare tickets: number;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare golds: number;

  @AllowNull(true)
  @Column({ type: DataType.BIGINT })
  declare tags: bigint;

  @AllowNull(false)
  @Column({ type: DataType.STRING(32) })
  declare type: WallpaperType;

  //? Foreign keys
  @ForeignKey(() => Event)
  @Column({ type: DataType.STRING })
  declare event_id: string;

  //? Others columns
  @BelongsTo(() => Event, { foreignKey: 'event_id' })
  declare event: Event;
}
