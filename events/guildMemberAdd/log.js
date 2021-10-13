const { GuildMember, CommandInteraction } = require('discord.js')
const { createCanvas, loadImage } = require('canvas')
const images = require('../../structures/images')
const icons = require('../../structures/icons')
const color = '#57f287'

/**
 * @param { { databases: import("../../structures/typing").Databases, params: [GuildMember, CommandInteraction] } } param0
 */
module.exports = async ({ databases: { guilds }, params: [member, preview] }) => {
  if (member.user.bot) return

  const [guild = {}] = await guilds.query(
    `SELECT channel, wallpapers.id AS image, color, display, reason FROM guilds.logs as logs
    LEFT JOIN guilds.logs_extra AS ex ON ex.guild = "${member.guild.id}" AND ex.type = "join" 
    LEFT JOIN guilds.blacklist AS blacklist ON blacklist.id = "${member.guild.id}" 
    LEFT JOIN items.guild_wallpapers AS wallpapers ON IF(ex.image, ex.image, 'default') = wallpapers.id
    WHERE logs.guild = "${member.guild.id}" AND logs.type = "join";`
  )

  if (guild.reason || !guild.channel) return
  Object.resolve(guild, { display: 'canvas' })

  const channel = preview ? preview.channel : await member.guild.channels.fetch(guild.channel || true).catch(() => null)
  if (channel) {
    if (guild.display == 'canvas' && channel.permissionsFor(member.guild.me).has(1n << 15n)) {
      const ctx = createCanvas(1070, 320).getContext('2d')

      /* Draw zone */
      ctx.roundRect(0, 0, ctx.canvas.width, ctx.canvas.height, { rayon: 8 })
      ctx.clip()
      ctx.save()

      /* Background */
      ctx.drawImage(await images.fetch(`guild-logs/${guild.image}`), 0, 0, ctx.canvas.width, ctx.canvas.height)

      /* Label */
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.rect(0, 0, 12, ctx.canvas.height)
      ctx.fill()
      ctx.closePath()

      /* Avatar */
      ctx.beginPath()
      ctx.fillStyle = guild.color
      ctx.roundRect(786, 36, 248, 248, { rayon: 8 })
      ctx.fill()
      ctx.roundRect(790, 40, 240, 240, { rayon: 8 })
      ctx.clip()
      ctx.drawImage(await loadImage(member.user.displayAvatarURL({ format: 'png', size: 512 })), 790, 40, 240, 240)
      ctx.restore()
      ctx.closePath()

      /* Icon */
      ctx.drawImage(await icons.fetch('others/sign-in'), 42, 232, 48, 48)

      /* Username */
      ctx.beginPath()
      ctx.font = `64px "Gemunu Libre bold, ${ctx.supportFonts}"`
      let username = member.user.username
      while (ctx.measureText(username).width > 650) username = username.slice(0, username.length - 2)
      ctx.fillStyle = guild.color
      ctx.fillText(`${username}`, 102, 276)
      ctx.closePath()

      channel.send({ files: [{ attachment: ctx.canvas.toBuffer(), name: 'join.png' }] })
    } else channel.send({ embeds: [{ color, author: { name: `Bienvenue dans notre guilde ${member.user.tag}`, icon_url: member.user.displayAvatarURL({ dynamic: true }) } }] })
  }
}
