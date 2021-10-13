const { CommandInteraction, GuildBan } = require('discord.js')
const color = '#ed4245'

/**
 * @param { { databases: import("../../structures/typing").Databases, params: [GuildBan, CommandInteraction] } } param0
 */
module.exports = async ({ databases: { guilds }, params: [ban, preview] }) => {
  if (ban.user.bot) return

  const [guild = {}] = await guilds.query(`SELECT channel, reason FROM logs LEFT JOIN blacklist ON blacklist.id = "${ban.guild.id}" WHERE logs.guild = "${ban.guild.id}" AND logs.type = "ban";`)
  const channel = preview ? preview.channel : await ban.guild.channels.fetch(guild.channel || true).catch(() => null)

  if (!guild.reason && channel) {
    const bans_size = (await ban.guild.bans.fetch().catch(() => null))?.size
    const embed = { color, author: { name: '🛑 • Membre banni(e) de la guilde' }, thumbnail: { url: ban.user.displayAvatarURL({ dynamic: true }) }, description: `> \`${ban.user.tag} [${ban.user.id}]\``, timestamp: Date.now() }
    if (ban.reason) embed.description += `\n\`\`\`asciidoc\nRaison(s) :: ${ban.reason}\`\`\``
    if (bans_size) embed.footer = { text: `${bans_size.form()} bans` }
    channel.send({ embeds: [embed] })
  }
}
