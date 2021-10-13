const names = require('../../../../../../structures/names.json').logs

module.exports = {
  option: {
    type: 'SUB_COMMAND',
    name: 'enable',
    description: 'Activer certains log sur votre guilde',
    options: [
      { name: 'log', description: 'Sélectionner le log à activer', type: 'STRING', required: true, choices: Object.entries(names).map(([value, name]) => ({ name, value })) },
      { name: 'channel', description: 'Sélectionner le salon textuel du log', type: 'CHANNEL', required: true },
    ],
  },

  /**
   * @param { import('../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ databases: { guilds }, interaction }) => {
    const type = interaction.options.getString('log', true)
    const [log] = await guilds.query(`SELECT channel FROM logs WHERE logs.guild = "${interaction.guildId}" AND logs.type = "${type}";`)

    if (log) {
      const channel = await interaction.guild.channels.fetch(log.channel).catch(() => null)
      interaction.error({ content: `Le log **${names[type]}** est déjà actif dans le salon ${channel || '#null'}` })
    } else {
      const channel = interaction.options.getChannel('channel', true)
      if (!channel.isText()) return interaction.error({ content: "Ce salon n'est pas un salon textuel" })
      guilds.query(`INSERT INTO logs (guild, type, channel) VALUES ("${interaction.guildId}", "${type}", "${channel.id}");`)
      interaction.reply({ content: `**\`| \`** Le log **${names[type]}** vient d'être activé sur cette guilde` })
    }
  },
}
