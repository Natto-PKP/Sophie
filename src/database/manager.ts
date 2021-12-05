/* Dependencies */
import { createConnection } from 'mysql';

/* Services */
import { Logger } from '../structures/services/logger';

/* Other */
import { connection } from '../secret.json';

/* Typings */
import { DatabaseNames } from '../structures/typings/sophie';

/**
 * Manage database
 */
export class DatabaseManager {
  /**
   * Create all connection
   */
  static users = createConnection({ database: 'users', ...connection });
  static guilds = createConnection({ database: 'users', ...connection });
  static items = createConnection({ database: 'users', ...connection });
  static counters = createConnection({ database: 'users', ...connection });

  /**
   * Make request
   * @param name
   * @param sql
   * @returns
   */
  async query(name: DatabaseNames, sql: string): Promise<any[] | unknown> {
    return await new Promise((resolve, reject) => {
      DatabaseManager[name].query(sql, (error, results) => {
        Array.isArray(results) ? resolve(results) : reject(error);
      });
    }).catch((err) => Logger.error(err));
  } // [end] Make request
} // [end] Manage database
