/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import ItemWallpaper from '../items/wallpaper';
import UserProfile from './profile';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, IsUUID, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';

export type UserBackgroundModel = BaseEntity<{
  //? Columns
  id: string;

  //? Foreign Keys
  wallpaper_id: string;
  profile_id: string;

  //? Others models
  wallpaper: ItemWallpaper;
}>;

@Table({ tableName: 'backgrounds', schema: 'users' })
export default class UserBackground extends Model implements UserBackgroundModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  //? Foreign Keys
  @ForeignKey(() => ItemWallpaper)
  @Column({ type: DataType.STRING })
  declare wallpaper_id: string;

  @ForeignKey(() => UserProfile)
  @Column({ type: DataType.STRING })
  declare profile_id: string;

  //? Others models
  @BelongsTo(() => ItemWallpaper, { foreignKey: 'wallpaper_id' })
  declare wallpaper: ItemWallpaper;
}
