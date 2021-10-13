const { Guild } = require('discord.js')
const { inspect } = require('util')

module.exports = {
  option: {
    name: 'delete',
    description: 'Supprimez vos commandes',
    type: 'SUB_COMMAND',
    options: [
      { name: 'command', description: "Précisez l'id de la commande", type: 'STRING', required: true },
      { name: 'guild', description: "Précisez l'id de la guilde", type: 'STRING' },
    ],
  },

  /**
   * @param { import('../../../../../../../structures/typing').Params<'command'> & { values: { command: string, guild: Guild } } } param0
   */
  execute: async ({ client, interaction, values }) => {
    if (values.command == '873291760233771109') return interaction.error({ content: 'Impossible de supprimer cette commande.' })

    if (!(await client.application.commands.fetch(values.command, { guildId: values.guild?.id }))) return interaction.error({ content: 'La commande indiquée est introuvable.' })

    client.application.commands.delete(values.command, values.guild?.id).then(
      () => interaction.reply({ content: '**`🟣 | `** La commande a bien été supprimer.' }),
      err => interaction.error({ content: 'Une erreur lors de la supression est survenue.', ephemeral: false, files: [{ attachment: Buffer.from(inspect(err, false, 10), 'utf-8'), name: 'error.txt' }] })
    )
  },
}
