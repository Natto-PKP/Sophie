const { CommandInteraction, Message } = require('discord.js')
const color = '#faa61a'

/**
 * @param { { databases: import("../../structures/typing").Databases, params: [Message,  CommandInteraction] } } param0
 */
module.exports = async ({ databases: { guilds }, params: [message, preview] }) => {
  if (message.author.bot) return

  const [guild = {}] = await guilds.query(`SELECT channel, reason FROM logs LEFT JOIN blacklist ON blacklist.id = "${message.guild.id}" WHERE logs.guild = "${message.guild.id}" AND logs.type = "message-delete";`)
  const channel = preview ? preview.channel : await message.guild.channels.fetch(guild.channel || true).catch(() => null)

  if (!guild.reason && channel) {
    const embed = { color, author: { name: '📝 • Message supprimé' }, description: `> ${message.author} - ${message.channel} | \`contenu\`:`, timestamp: Date.now(), footer: { text: `user: ${message.author.id} • channel: ${message.channel.id}` } }
    if (message.content?.length) embed.description += `\n\n${message.content.length > 3500 ? message.content.slice(0, 3500) + '...' : message.content}`
    if (message.attachments?.size) embed.description += `\n\n${message.attachments.map(({ url }) => `**-** <${url}>`).join('\n')}`
    channel.send({ embeds: [embed] })
  }
}
