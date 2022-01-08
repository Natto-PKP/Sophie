/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import User from './user';
import UserWallpaper from './wallpaper';
import ItemWallpaper from '../items/wallpapers';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, ForeignKey, HasOne, HasMany, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';

export type UserProfileModel = BaseEntity<{
  //? Columns
  id: string;

  //? Foreign Keys
  user_id: string;
  active_wallpaper_id: string;

  //? Others models
  wallpapers: UserWallpaper[];
  wallpaper: ItemWallpaper;
}>;

@Table({ tableName: 'profiles', schema: 'users' })
export default class UserProfile extends Model implements UserProfileModel {
  //? Columns
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  //? Foreign Keys
  @ForeignKey(() => User)
  @Column({ type: DataType.STRING })
  declare user_id: string;

  @ForeignKey(() => ItemWallpaper)
  @Column({ type: DataType.STRING })
  declare active_wallpaper_id: string;

  //? Others models
  @HasMany(() => UserWallpaper, { foreignKey: 'profile_id' })
  declare wallpapers: UserWallpaper[];

  @BelongsTo(() => ItemWallpaper, { foreignKey: 'active_wallpaper_id' })
  declare wallpaper: ItemWallpaper;
}
