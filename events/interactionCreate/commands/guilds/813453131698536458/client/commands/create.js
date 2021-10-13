const { Guild } = require('discord.js')
const { existsSync } = require('fs')

module.exports = {
  option: {
    name: 'create',
    description: 'Postez une nouvelle commande',
    type: 'SUB_COMMAND',
    options: [
      { name: 'command', description: 'Précisez le nom de la commande', type: 'STRING', required: true },
      { name: 'guild', description: "Précisez l'id/nom de la guilde", type: 'STRING' },
    ],
  },

  /**
   * @param { import('../../../../../../../structures/typing').Params<'command'> & { values: { command: string, guild: Guild } } } param0
   */
  execute: async ({ client, interaction, values }) => {
    if (existsSync(`./events/interactionCreate/commands/${values.guild ? `guilds/${values.guild.id}` : `global`}/${values.command}.js`)) {
      const { body, options } = require(`../../../../${values.guild ? `guilds/${values.guild.id}` : `global`}/${values.command}`)

      try {
        if (options && options.type) await client.application.commands.create({ name: body.name, type: options.type }, values.guild?.id)
        await client.application.commands.create(body, values.guild?.id)
        interaction.reply({ content: '**`🟣 | `** La commande a bien été créer.' })
      } catch (error) {
        interaction.error({ content: 'Une erreur lors de la création est survenue.', log: true, error })
      }
    } else interaction.error({ content: "Cette commande n'a pas de fichier interne." })
  },
}
