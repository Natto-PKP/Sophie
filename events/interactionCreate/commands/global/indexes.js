const { readdirSync } = require('fs')

const sub_commands = readdirSync('./events/interactionCreate/commands/global/indexes').map(file => require(`./indexes/${file}`))

module.exports = {
  body: { name: 'indexes', description: "Affichez toutes vos collections d'items obtenus", options: sub_commands.map(sub_command => sub_command.option) },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ client, databases, interaction }) => sub_commands.find(({ option }) => option.name == interaction.options.getSubcommand())?.execute({ client, databases, interaction }),
}
