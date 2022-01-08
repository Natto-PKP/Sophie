/* Dependencies */
import { v4 as UUIDV4 } from 'uuid';

/* Models */
import User from './user';

/* Typings */
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, IsUUID, Default, ForeignKey } from 'sequelize-typescript';
import { BaseEntity } from '../../structures/typings/custom';

/* */
export type UserExperienceModel = BaseEntity<{
  id: string;
  tier: number;
  level: number;
  points: number;
  user_id: string;
}>;

@Table({ tableName: 'experiences', schema: 'users' })
export default class UserExperience extends Model implements UserExperienceModel {
  /* Columns */
  @PrimaryKey
  @IsUUID(4)
  @Default(() => UUIDV4())
  @Column({ type: DataType.STRING })
  declare id: string;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare tier: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare level: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare points: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING })
  declare user_id: string;
}
