import dotenv from 'dotenv';
dotenv.config();

/* Init database */
import { sequelize } from './database';

/* Start Bot */
import { Sucrose } from './structures/sucrose';

new Sucrose({ intents: 14319, partials: ['CHANNEL'] }, { sequelize });
