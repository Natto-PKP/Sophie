const { readdirSync } = require('fs')

const sub_command_groups = []
readdirSync('./events/interactionCreate/commands/guilds/813453131698536458/client').forEach(file => file.endsWith('.js') && sub_command_groups.push(require(`./client/${file}`)))

module.exports = {
  body: { name: 'client', description: 'Configuration et options du client. (owners seulement)', options: sub_command_groups.map(group => group.option) },

  /**
   * @param { import('../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, databases, interaction }) => {
    if (interaction.user.id !== '570642674151981135') return interaction.error({ content: 'Cette commande ne vous est pas disponible' })
    sub_command_groups.find(({ option }) => option.name == interaction.options.getSubcommandGroup())?.execute({ client, databases, interaction })
  },
}
