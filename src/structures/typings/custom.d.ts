import { Sequelize } from 'sequelize/dist';

export interface Params {
  sequelize: Sequelize;
}

export type BaseEntity<T> = Omit<T, 'createdAt' | 'deletedAt' | 'updatedAt'>;
