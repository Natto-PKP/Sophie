const { Guild } = require('discord.js')
const { inspect } = require('util')

module.exports = {
  option: {
    name: 'fetch',
    description: 'Obtenez les informations de vos commandes',
    type: 'SUB_COMMAND',
    options: [
      { name: 'command', description: "Précisez l'id de la commande", type: 'STRING' },
      { name: 'guild', description: "Précisez l'id de la guilde", type: 'STRING' },
    ],
  },

  /**
   * @param { import('../../../../../../../structures/typing').Params<'command'> & { values: { command: string, guild: Guild } } } param0
   */
  execute: async ({ client, interaction, values }) => {
    if (values.command) {
      values.command = await client.application.commands.fetch(values.command, { guildId: values.guild?.id }).catch(err => interaction.error({ content: 'Une erreur lors de la création est survenue.', ephemeral: false, files: [{ attachment: Buffer.from(inspect(err, false, 10), 'utf-8'), name: 'error.txt' }] }))
      if (!values.command) interaction.error({ content: 'La commande indiquée est introuvable.' })
      else interaction.reply({ content: `**\`🟣 | \`** Commande ${values.command.name}.`, files: [{ attachment: Buffer.from(inspect(values.command.options, false, 10), 'utf-8'), name: 'options.js' }] })
    } else {
      const commands = await (values.guild ? values.guild.commands.fetch() : client.application.commands.fetch())
      if (!commands || !commands.size) interaction.error({ content: 'Aucune commande disponible.' })
      else interaction.reply({ content: '**`🟣 | `** Commandes.', files: [{ attachment: Buffer.from(inspect(commands.map(({ name, id, description }) => ({ name, id, description })))), name: 'commands.js' }] })
    }
  },
}
