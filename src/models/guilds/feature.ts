/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import Guild from './guild';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, ForeignKey } from 'sequelize-typescript';
import { GuildFeatureType } from '../../structures/typings/database';
import { BaseEntity } from '../../structures/typings/custom';

export type GuildFeatureModel = BaseEntity<{
  //? Columns
  id: string;
  type: GuildFeatureType;

  //? Foreign keys
  guild_id: string;
}>;

@Table({ tableName: 'features', schema: 'guilds' })
export default class GuildFeature extends Model implements GuildFeatureModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(32) })
  declare type: GuildFeatureType;

  //? Foreign keys
  @ForeignKey(() => Guild)
  declare guild_id: string;
}
