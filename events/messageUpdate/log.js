const { CommandInteraction, Message } = require('discord.js')
const color = '#faa61a'

/**
 * @param { { databases: import("../../structures/typing").Databases, params: [Message, Message, CommandInteraction] } } param0
 */
module.exports = async ({ databases: { guilds }, params: [old_message, new_message, preview] }) => {
  if (old_message.author.bot || !old_message.content?.length || !new_message.content?.length || old_message.content == new_message.content) return

  const [guild = {}] = await guilds.query(`SELECT channel, reason FROM logs LEFT JOIN blacklist ON blacklist.id = "${old_message.guild.id}" WHERE logs.guild = "${old_message.guild.id}" AND logs.type = "message-update";`)
  const channel = preview ? preview.channel : await old_message.guild.channels.fetch(guild.channel || true).catch(() => null)

  if (!guild.reason && channel) {
    channel.send({
      embeds: [
        {
          color,
          author: { name: '📝 • Message édité' },
          description: `> ${old_message.author} - ${old_message.channel}`,
          fields: [
            { name: "✉ `Contenu d'origine`", value: old_message.content.length > 2000 ? old_message.content.slice(0, 2000) : old_message.content },
            { name: '📩 `Modifié`', value: new_message.content.length > 2000 ? new_message.content.slice(0, 2000) : new_message.content },
          ],
          timestamp: Date.now(),
          footer: { text: `user: ${old_message.author.id} • channel: ${old_message.channel.id}` },
        },
      ],
    })
  }
}
