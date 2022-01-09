/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import GuildFeature from './feature';
import GuildLog from './log';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, HasMany } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';

export type GuildModel = BaseEntity<{
  //? Columns
  id: string;
  discord_id: string;
  flags: bigint;

  //? Others models
  features: GuildFeature[];
  logs: GuildLog[];
}>;

@Table({ tableName: 'guilds', schema: 'guilds' })
export default class Guild extends Model implements GuildModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare discord_id: string;

  @AllowNull(true)
  @Column({ type: DataType.BIGINT })
  declare flags: bigint;

  //? Others models
  @HasMany(() => GuildFeature, { foreignKey: 'guild_id' })
  declare features: GuildFeature[];

  @HasMany(() => GuildLog, { foreignKey: 'guild_id' })
  declare logs: GuildLog[];
}
