import { Params } from 'src/structures/typings';

/* Actions */
import usersExp from './actions/users_exp';

const actions: Array<(params: Params<'messageCreate'>) => void> = [usersExp];

export = {
  listener: (params: Params<'messageCreate'>) => {
    const [message] = params.args;

    //? handle actions
    if (message.guildId && !message.author.bot) actions.forEach((action) => action(params));
  },
};
