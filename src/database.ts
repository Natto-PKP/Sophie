/* Dependencies */
import { Sequelize } from 'sequelize-typescript';
import { readdirSync } from 'fs';
import path from 'path';

//? Add models files
const models = [];
for (const dir of readdirSync(path.resolve(__dirname, 'models'))) {
  for (const file of readdirSync(path.resolve(__dirname, 'models', dir))) {
    models.push(path.resolve(__dirname, 'models', dir, file));
  }
}

/* Export database */
export const sequelize = new Sequelize({ dialect: 'postgres', models, logging: false });

// sequelize.sync({ alter: true });
