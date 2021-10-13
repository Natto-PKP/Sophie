const flags = require('../../../../../../structures/flags').commands
const names = require('../../../../../../structures/names.json').commands

module.exports = {
  option: { type: 'SUB_COMMAND', name: 'disable', description: 'Désactiver certaines commandes sur votre serveur', options: [{ name: 'command', description: 'Sélectionner la commande à déactiver', type: 'STRING', required: true, choices: Object.entries(names).map(([value, name]) => ({ name, value })) }] },

  /**
   * @param { import('../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ databases: { guilds }, interaction }) => {
    const [guild = {}] = await guilds.query(`SELECT commands FROM features WHERE id = "${interaction.guild.id}";`)
    Object.resolve(guild, { commands: 0 })

    const command = interaction.options.getString('command', true)

    if (BigInt(guild.commands).has(flags[command], 'commands')) {
      const commands = Number(BigInt(guild.commands) & ~flags[command])
      const guild_command = (await interaction.guild.commands.fetch()).find(({ name }) => name == command)

      if (guild_command) await guild_command.delete().catch(() => null)
      guilds.query(`INSERT INTO features (id, commands) VALUES ("${interaction.guildId}", ${commands}) ON DUPLICATE KEY UPDATE commands = ${commands};`)
      interaction.reply({ content: `**\`| \`** La commande **${names[command]}** vient d'être désactivée sur cette guilde` })
    } else interaction.error({ content: "Cette commande n'est pas active sur votre guilde" })
  },
}
