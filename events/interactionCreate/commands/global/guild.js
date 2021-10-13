const { readdirSync } = require('fs')

const sub_command_groups = []
readdirSync('./events/interactionCreate/commands/global/guild').forEach(file => file.endsWith('.js') && sub_command_groups.push(require(`./guild/${file}`)))

module.exports = {
  body: { name: 'guild', description: 'Configurez nous pour votre serveur', options: sub_command_groups.map(({ option }) => option) },
  options: { permissions: { member: 1n << 5n }, guild: true },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ client, databases, interaction }) => sub_command_groups.find(({ option }) => option.name == interaction.options.getSubcommandGroup())?.execute({ client, databases, interaction }),
}
