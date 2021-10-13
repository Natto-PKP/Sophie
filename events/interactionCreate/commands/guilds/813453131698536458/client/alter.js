const { readdirSync } = require('fs')
const sub_commands = readdirSync('./events/interactionCreate/commands/guilds/813453131698536458/client/alter').map(file => require(`./alter/${file}`))

module.exports = {
  option: { name: 'alter', description: "Modification de valeurs d'users dans la base de données.", type: 'SUB_COMMAND_GROUP', options: sub_commands.map(group => group.option) },

  /**
   * @param { import('../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ client, databases, interaction }) => sub_commands.find(({ option }) => option.name == interaction.options.getSubcommand())?.execute({ client, databases, interaction }),
}
