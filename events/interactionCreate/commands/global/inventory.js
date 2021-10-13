const { readdirSync } = require('fs')

const sub_commands = readdirSync('./events/interactionCreate/commands/global/inventory').map(file => require(`./inventory/${file}`))

module.exports = {
  body: { name: 'inventory', description: 'Ouvrez votre inventaire', options: sub_commands.map(sub_command => sub_command.option) },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ client, databases, interaction }) => sub_commands.find(({ option }) => option.name == interaction.options.getSubcommand())?.execute({ client, databases, interaction, options: interaction.options.data[0].options }),
}
