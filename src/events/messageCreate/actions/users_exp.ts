/* Models */
import User from '../../../models/users/user';
import UserExperience from '../../../models/users/experience';
import UserEconomie from '../../../models/users/economie';

/* Typings */
import { Params } from 'src/structures/typings';

/* User exp config */
export const config = {
  exp_per_level: 85, // Base exp required per level
  exp_multiplicator: 1.35, // Base exp multiplicator

  /**
   * Get random exp
   * @returns { number }
   */
  getMessageExp: () => {
    const weekend = [0, 6].includes(new Date().getDay());
    return Math.ceil(Math.random() * 4 + 2) * (weekend ? 2 : 1);
  },

  /**
   * Get total exp for next level
   * @param { number } level
   * @returns { number }
   */
  getLevelExp: (level: number) => {
    if (level === 0) return Math.ceil(config.exp_per_level / 2);
    else return Math.ceil(level * config.exp_per_level * config.exp_multiplicator);
  },
};

/* cooldowns cache */
export const cooldowns: { [key: string]: number } = {};

export default async ({ args: [message] }: Params<'messageCreate'>): Promise<void> => {
  const discord_id = message.author.id;
  const [user] = await User.findOrBuild({
    where: { discord_id },
    include: [UserExperience, UserEconomie],
    defaults: { discord_id, experience: {}, economie: {} },
  });

  if (cooldowns[discord_id] && cooldowns[discord_id] > Date.now()) return;
  const random = config.getMessageExp();
  const limit = config.getLevelExp(user.experience.level);

  if (user.experience.points + random >= limit) {
    if (user.experience.level % 2 === 0) user.economie.tickets += 1;
    user.experience.points = user.experience.points + random - limit;
    user.experience.level += 1;
    await message.react('♥️');
  } else user.experience.points += random;

  cooldowns[discord_id] = Date.now() + 2500;
  await user.save();
};

//! Clean cache
setInterval(() => {
  for (const key in cooldowns) if (cooldowns[key] > Date.now()) delete cooldowns[key];
}, 60 * 60 * 1000);
