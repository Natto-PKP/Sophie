const { readdirSync } = require('fs')

const sub_commands = readdirSync('./events/interactionCreate/commands/guilds/813453131698536458/client/commands').map(file => require(`./commands/${file}`))

module.exports = {
  option: { name: 'commands', description: 'Gérez les commandes du client', type: 'SUB_COMMAND_GROUP', options: sub_commands.map(group => group.option) },

  /**
   * @param { import('../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, interaction }) => {
    const values = { command: interaction.options.getString('command'), guild: interaction.options.getString('guild') }

    if (values.guild) {
      values.guild = client.guilds.cache.find(guild => (['this', 'here'].includes(values.guild.toLowerCase()) ? guild.id == interaction.guild.id : guild.id == values.guild || guild.name.toLowerCase().includes(values.guild.toLowerCase())))
      if (!values.guild) return interaction.error({ content: "Cette guilde n'est pas disponible" })
    }

    sub_commands.find(({ option }) => option.name == interaction.options.getSubcommand())?.execute({ client, interaction, values })
  },
}
