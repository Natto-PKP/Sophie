const { readdirSync } = require('fs')

const sub_commands = readdirSync('./events/interactionCreate/commands/global/guild/logs').map(file => require(`./logs/${file}`))

module.exports = {
  option: { type: 'SUB_COMMAND_GROUP', name: 'logs', description: 'Gérez les logs pour votre guilde', options: sub_commands.map(({ option }) => option) },

  /**
   * @param { import('../../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ client, databases, interaction }) => sub_commands.find(({ option }) => option.name == interaction.options.getSubcommand())?.execute({ client, databases, interaction }),
}
