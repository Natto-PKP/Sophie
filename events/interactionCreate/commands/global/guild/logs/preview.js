const names = require('../../../../../../structures/names.json').logs

module.exports = {
  option: {
    type: 'SUB_COMMAND',
    name: 'preview',
    description: 'Prévisualiser vos logs',
    options: [{ name: 'log', description: 'Sélectionner le log à désactiver', type: 'STRING', required: true, choices: Object.entries(names).map(([value, name]) => ({ name, value })) }],
  },

  /**
   * @param { import('../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, interaction, databases: { guilds } }) => {
    const [log] = await guilds.query(`SELECT type FROM logs WHERE guild = "${interaction.guildId}" AND type = "${interaction.options.getString('log', true)}";`)

    if (log) {
      const [event, ...params] = {
        join: ['guildMemberAdd', () => interaction.member],
        leave: ['guildMemberRemove', () => interaction.member],
        ban: ['guildBanAdd', () => ({ guild: interaction.guild, reason: 'Il a mangé tout les cookies !', user: interaction.user })],
        unban: ['guildBanRemove', () => ({ guild: interaction.guild, user: interaction.user })],
        'message-delete': ['messageDelete', () => ({ guild: interaction.guild, author: interaction.user, channel: interaction.channel, content: "Je n'ai pas été supprimé, c'est faux !" })],
        'message-update': ['messageUpdate', () => ({ guild: interaction.guild, author: interaction.user, channel: interaction.channel, content: "J'aime les chats !" }), () => ({ guild: interaction.guild, author: interaction.user, channel: interaction.channel, content: "J'aime les furets !" })],
      }[log.type]

      await interaction.confirm({ content: `Prévisualisation :: \`${names[log.type]}\`` })
      client.emit(event, ...params.map(param => param()), interaction)
    } else interaction.error({ content: "Ce log n'est pas activé sur votre serveur" })
  },
}
