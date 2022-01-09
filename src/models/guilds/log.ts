/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import Guild from './guild';
import ItemWallpaper from '../items/wallpaper';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { GuildLogType } from '../../structures/typings/database';
import { BaseEntity } from '../../structures/typings/custom';

export type GuildLogModel = BaseEntity<{
  //? Columns
  id: string;
  type: GuildLogType;

  //? Foreign keys
  guild_id: string;
  wallpaper_id: string;

  //? Others models
  wallpaper: ItemWallpaper;
}>;

@Table({ tableName: 'logs', schema: 'guilds' })
export default class GuildLog extends Model implements GuildLogModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(32) })
  declare type: GuildLogType;

  //? Foreign keys
  @ForeignKey(() => Guild)
  declare guild_id: string;

  @ForeignKey(() => ItemWallpaper)
  declare wallpaper_id: string;

  //? Others models
  @BelongsTo(() => ItemWallpaper, { foreignKey: 'wallpaper_id' })
  declare wallpaper: ItemWallpaper;
}
