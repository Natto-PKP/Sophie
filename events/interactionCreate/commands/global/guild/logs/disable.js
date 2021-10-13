const names = require('../../../../../../structures/names.json').logs

module.exports = {
  option: {
    type: 'SUB_COMMAND',
    name: 'disable',
    description: 'Désactiver certains log sur votre serveur',
    options: [{ name: 'log', description: 'Sélectionner le log à désactiver', type: 'STRING', required: true, choices: Object.entries(names).map(([value, name]) => ({ name, value })) }],
  },

  /**
   * @param { import('../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ databases: { guilds }, interaction }) => {
    const type = interaction.options.getString('log', true)
    const [log] = await guilds.query(`SELECT channel FROM logs WHERE logs.guild = "${interaction.guildId}" AND logs.type = "${type}";`)

    if (log) {
      guilds.query(`DELETE FROM logs WHERE guild = "${interaction.guildId}" AND type = "${type}";`)
      guilds.query(`DELETE FROM logs_extra WHERE guild = "${interaction.guildId}" AND type = "${type}";`)
      interaction.reply({ content: `**\`| \`** Le log **${names[type]}** vient d'être désactivé de cette guilde` })
    } else interaction.error({ content: `Le log **${names[type]}** n'est pas actif sur ce serveur` })
  },
}
