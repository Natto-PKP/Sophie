/* Models */
import User from '../../../models/users/user';

/* Typings */
import { Params } from 'src/structures/typings';

/* User exp config */
export const config = {
  exp_per_level: 85, // Base exp required per level
  exp_multiplicator: 1.35, // Base exp multiplicator

  /**
   * Get random exp
   */
  getMessageExp: () => {
    const weekend = [0, 6].includes(new Date().getDay());
    return Math.ceil(Math.random() * 4 + 2) * (weekend ? 2 : 1);
  },

  /**
   * Get total exp for next level
   * @param level
   */
  getLevelExp: (level: number) => {
    return level === 0 ? Math.ceil(config.exp_per_level / 2) : Math.ceil(level * config.exp_per_level * config.exp_multiplicator);
  },
};

/* cooldowns cache */
export const cooldowns: { [key: string]: number } = {};

export default async ({ args: [message] }: Params<'messageCreate'>) => {
  // const id = message.author.id;
  // if (cooldowns[id] && cooldowns[id] > Date.now()) return;
  // const random = config.getMessageExp();
  // const limit = config.getLevelExp(user.level);
  // if (user.points + random >= limit) {
  //   user.points = user.points + random - limit;
  //   user.level += 1;
  //   await message.react('♥️');
  // } else user.points += random;
  // cooldowns[id] = Date.now() + 2500;
};

//! Clean cache
setInterval(() => {
  for (const key in cooldowns) if (cooldowns[key] > Date.now()) delete cooldowns[key];
}, 60 * 60 * 1000);
