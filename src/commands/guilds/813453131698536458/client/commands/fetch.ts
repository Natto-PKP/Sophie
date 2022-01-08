import { Logger } from '../../../../../structures/services/logger';
import { inspect } from 'util';

/* Typings */
import { CommandOption } from 'src/structures/typings';

export = <CommandOption>{
  option: {
    name: 'fetch',
    description: 'Obtenez les informations de vos commandes',
    type: 'SUB_COMMAND',

    options: [
      { name: 'command', description: 'Précisez le nom de la commande', type: 'STRING' },
      { name: 'guild', description: "Précisez l'id/nom de la guilde", type: 'STRING' },
    ],
  },

  exec: async ({ sucrose, interaction }) => {
    const command = interaction.options.getString('command', false);
    const guild_id = interaction.options.getString('guild', false);

    try {
      const data = await sucrose.interactions.commands.fetch({ commandId: command || undefined, guildId: guild_id || undefined });
      const attachment = Buffer.from(inspect(JSON.stringify(data), false, 10), 'utf-8');

      interaction.reply({ content: '⭕ `| Opération réussi `', files: [{ attachment, name: 'commands.json' }] });
    } catch (err) {
      if (!(err instanceof Error)) return;
      interaction.reply({ content: `❌ \`| erreur : \` ${err.message}` });
      Logger.error(err);
    }
  },
};
