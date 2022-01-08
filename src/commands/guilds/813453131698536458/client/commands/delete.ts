import { Logger } from '../../../../../structures/services/logger';

/* Typings */
import { CommandOption } from 'src/structures/typings';

export = <CommandOption>{
  option: {
    name: 'delete',
    description: 'Supprimez vos commande',
    type: 'SUB_COMMAND',

    options: [
      { name: 'command', description: 'Précisez le nom de la commande', type: 'STRING', required: true },
      { name: 'guild', description: "Précisez l'id/nom de la guilde", type: 'STRING' },
    ],
  },

  exec: async ({ sucrose, interaction }) => {
    const command = interaction.options.getString('command', true);
    const guild_id = interaction.options.getString('guild', false);

    try {
      await sucrose.interactions.commands.delete(command, guild_id || undefined);
      interaction.reply({ content: '⭕ `| Opération réussi `' });
    } catch (err) {
      if (!(err instanceof Error)) return;
      interaction.reply({ content: `❌ \`| erreur : \` ${err.message}` });
      Logger.error(err);
    }
  },
};
