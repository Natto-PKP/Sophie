const { Guild, Client } = require('discord.js')
const color = '#57f287'

/**
 * @param { { client: Client, params: [Guild] } } param0
 */
module.exports = async ({ client, params: [guild] }) => {
  const channel = await client.channels.fetch('897146217203646514')

  channel.send({
    embeds: [
      {
        color,
        author: { name: `🗂 • Sophie est invitée sur ${guild.name}` },
        thumbnail: { url: guild.iconURL({ dynamic: true }) },
        fields: [
          { name: '\u200B', value: `👑 \`${(await guild.fetchOwner())?.user?.username}\``, inline: true },
          { name: '\u200B', value: `➕ **${guild.memberCount.form()}** membres`, inline: true },
        ],
        footer: { text: `${guild.id} • ${(await client.guilds.fetch()).size} guildes` },
      },
    ],
  })
}
