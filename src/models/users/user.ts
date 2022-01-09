/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import UserExperience from './experience';
import UserEconomie from './economie';
import UserProfile from './profile';
import UserIndexe from './indexe';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, HasOne, HasMany } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';

export type UserModel = BaseEntity<{
  //? Columns
  id: string;
  discord_id: string;
  flags: bigint;

  //? Others models
  experience: UserExperience;
  economie: UserEconomie;
  profile: UserProfile;
  indexes: UserIndexe[];
}>;

@Table({ tableName: 'users', schema: 'users' })
export default class User extends Model implements UserModel {
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
  @HasOne(() => UserExperience, { foreignKey: 'user_id' })
  declare experience: UserExperience;

  @HasOne(() => UserEconomie, { foreignKey: 'user_id' })
  declare economie: UserEconomie;

  @HasOne(() => UserProfile, { foreignKey: 'user_id' })
  declare profile: UserProfile;

  @HasMany(() => UserIndexe, { foreignKey: 'user_id' })
  declare indexes: UserIndexe[];
}
