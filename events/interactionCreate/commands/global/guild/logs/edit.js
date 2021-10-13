const names = require('../../../../../../structures/names.json').logs

module.exports = {
  option: {
    type: 'SUB_COMMAND',
    name: 'edit',
    description: 'Mettre à jour certains log sur votre serveur',
    options: [
      { name: 'log', description: 'Sélectionner le log à mettre à jour', type: 'STRING', required: true, choices: Object.entries(names).map(([value, name]) => ({ name, value })) },
      { name: 'channel', description: 'Sélectionner le salon ou sera executer le log', type: 'CHANNEL' },
      {
        name: 'display',
        description: "Changer l'affichage des logs join ou leave",
        type: 'STRING',
        choices: [
          { name: "Visuel • sous forme d'image", value: 'canvas' },
          { name: 'Compact • message de bienvenue', value: 'embed' },
        ],
      },
      {
        name: 'image',
        description: 'Changez le thème des images des logs join ou leave',
        type: 'STRING',
        choices: [{ name: 'Paysage minimaliste (violet)', value: 'default' }],
      },
    ],
  },

  /**
   * @param { import('../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ databases: { guilds }, interaction }) => {
    const news = { target: interaction.options.getString('log', true), channel: interaction.options.getChannel('channel'), image: interaction.options.getString('image'), display: interaction.options.getString('display') }
    const [log] = await guilds.query(`SELECT channel, image, display, ex.type FROM logs LEFT JOIN logs_extra AS ex ON ex.guild = "${interaction.guildId}" AND ex.type = "${news.target}" WHERE logs.guild = "${interaction.guildId}" AND logs.type = "${news.target}";`)

    if (log) {
      if (news.channel || news.image || news.display) {
        if (!['join', 'leave'].includes(news.target) && (news.image || news.display)) return interaction.error({ content: 'Certaines de vos options sont seulement disponible pour les logs `join` et `leave`' })
        if (news.image) guilds.query(log.type ? `UPDATE logs_extra SET image = "${news.image}";` : `INSERT INTO logs_extra (guild, type, image) VALUES ("${interaction.guildId}", "${news.target}", "${news.image}");`)
        if (news.display) guilds.query(log.type ? `UPDATE logs_extra SET display = "${news.display}";` : `INSERT INTO logs_extra (guild, type, display) VALUES ("${interaction.guildId}", "${news.target}", "${news.display}");`)
        if (news.channel && news.channel.id != log.channel) {
          if (!news.channel.isText()) return interaction.error({ content: "Ce salon n'est pas un salon textuel" })
          guilds.query(`UPDATE logs SET channel = "${news.channel.id}" WHERE guild = "${interaction.guildId}" AND type = "${news.target}";`)
        }

        interaction.confirm({ content: `Le log **${news.target}** a bien été mis à jour` })
      } else interaction.error({ content: 'Appliquez des valeurs pour mettre à jour ce log' })
    } else interaction.error({ content: `Le log **${news.target}** n'est pas actif sur ce serveur` })
  },
}
