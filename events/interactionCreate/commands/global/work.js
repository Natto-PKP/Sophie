const { readdirSync } = require('fs')

const sub_commands = readdirSync('./events/interactionCreate/commands/global/work').map(file => require(`./work/${file}`))

module.exports = {
  body: { name: 'work', description: 'Travaillez pour gagner quelques yens', options: sub_commands.map(sub_command => sub_command.option) },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ client, databases, interaction }) => sub_commands.find(({ option }) => option.name == interaction.options.getSubcommand())?.execute({ client, databases, interaction }),
}
