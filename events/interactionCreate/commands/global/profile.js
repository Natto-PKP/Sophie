const { createCanvas, loadImage } = require('canvas')

const experiences = require('../../../../structures/experiences')
const images = require('../../../../structures/images')

module.exports = {
  body: { name: 'profile', description: "Voyez toute la progression d'un utilisateur.", options: [{ type: 'USER', name: 'user', description: 'Sélectionnez un utilisateur en particulier.' }] },
  options: { type: 'USER', permissions: { client: 1n << 15n } },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   * FAIRE UN TRUC POUR LES BANDEAU OWNER, PREMIUM, ETC
   */
  execute: async ({ client, databases: { users }, interaction }) => {
    const user = interaction.options.getUser('user') || interaction.user
    if (user.bot) return interaction.error({ content: "Impossible d'afficher le profile d'un bot" })

    const [result = {}] = await users.query(`SELECT flags, level, points, wallpapers.id AS wallpaper, color FROM items.wallpapers AS wallpapers LEFT JOIN users.experiences AS exp ON "${user.id}" = exp.id LEFT JOIN users.profiles AS profiles ON "${user.id}" = profiles.id WHERE IF(profiles.id = "${user.id}", profiles.wallpaper, "default") = wallpapers.id;`).catch(() => [])
    Object.resolve(result, { level: 0, points: 0 })

    const flags = result.flags ? BigInt(result.flags).resolve('users') : null
    const next = experiences.need(result.level)
    const ctx = createCanvas(1070, 420).getContext('2d')

    ctx.save()
    ctx.drawImage(await images.fetch(`profile/${result.wallpaper}`), 0, 0, ctx.canvas.width, ctx.canvas.height)

    // Avatar
    ctx.fillStyle = 'rgb(10, 10, 10)'
    ctx.roundRect(26, 156, 244, 244, { rayon: 8 })
    ctx.fill()
    ctx.roundRect(28, 158, 240, 240, { rayon: 8 })
    ctx.clip()
    ctx.drawImage(await loadImage(user.displayAvatarURL({ format: 'png', size: 512 })), 28, 158, 240, 240)
    ctx.restore()

    // Exp bar
    ctx.fillStyle = 'rgb(10, 10, 10)'
    ctx.roundRect(280, 326, 464, 74, { rayon: 8 })
    ctx.fill()
    ctx.fillStyle = result.color
    ctx.roundRect(288, 333, (result.points / next) * 100 * 4.52 > 20 ? (result.points / next) * 100 * 4.52 : 20, 60, { rayon: 8 })
    ctx.fill()
    ctx.restore()

    // Level bar
    ctx.font = '52px "Do Hyeon"'
    const levelContentWidth = ctx.measureText(result.level).width
    ctx.roundRect(282, 271, 45 + levelContentWidth, 50, { rayon: 4 })
    ctx.fillStyle = 'rgba(10, 10, 10, .75)'
    ctx.fill()
    ctx.strokeStyle = result.color
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = result.color
    ctx.fillText(result.level, 282 + (45 + levelContentWidth) / 2 - levelContentWidth / 2, 314)

    if (flags) {
      const [color, text] = { owner: [client.colors.default, 'OWNER'], admin: ['#ed4245', 'ADMIN'], modo: ['#58f287', 'MODO'], premium: ['#f7de52', 'GOLD'] }[flags.includes('owner') ? 'owner' : flags.includes('admin') ? 'admin' : flags.includes('modo') ? 'modo' : 'premium']
      ctx.beginPath()
      ctx.rotate((25 * Math.PI) / 180)
      ctx.fillStyle = color
      ctx.fillRect(680, -400, 400, 80)

      ctx.fillStyle = 'rgb(10, 10, 10)'
      ctx.font = '64px "Gemunu Libre bold"'
      ctx.fillText(text, 910 - ctx.measureText(text).width / 2, -340)

      ctx.closePath()
    }

    interaction.reply({ files: [{ attachment: ctx.canvas.toBuffer(), name: 'profile.png' }] })
  },
}
