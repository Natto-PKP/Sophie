const { createCanvas, loadImage } = require('canvas')

module.exports = {
  body: { name: 'lovecalc', description: 'Quel utilisateur aimez vous le plus ?', options: [{ type: 'USER', name: 'user', description: 'Sélectionnez un utilisateur.', required: true }] },
  options: { permissions: { client: 1n << 15n } },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ interaction }) => {
    const user = interaction.options.getUser('user')
    const calc = (Number(interaction.user.id) + Number(user.id)) % 101
    const ctx = createCanvas(500, 150).getContext('2d')

    ctx.save()
    ctx.fillStyle = 'rgba(10, 10, 10, .4)'
    ctx.fillRect(0, 35, 500, 80)
    ctx.drawImage(await loadImage('./storage/icons/8bit-heart/' + (calc > 80 ? 'full' : calc > 40 ? 'middle' : 'empty') + '.png'), 185, 10, 130, 130)
    ctx.font = '32px "Press Start 2P"'
    ctx.fillStyle = 'rgb(240, 240, 240)'
    ctx.fillText(calc + '%', 250 - ctx.measureText(calc + '%').width / 2, 90)
    ctx.roundRect(0, 0, 150, 150, { rayon: 10 })
    ctx.fillStyle = 'rgb(10, 10, 10)'
    ctx.fill()
    ctx.roundRect(2, 2, 146, 146, { rayon: 10 })
    ctx.clip()
    ctx.drawImage(await loadImage(interaction.user.displayAvatarURL({ format: 'png', size: 256 })), 2, 2, 146, 146)
    ctx.restore()
    ctx.roundRect(350, 0, 150, 150, { rayon: 10 })
    ctx.fillStyle = 'rgb(10, 10, 10)'
    ctx.fill()
    ctx.roundRect(352, 2, 146, 146, { rayon: 10 })
    ctx.clip()
    ctx.drawImage(await loadImage(user.displayAvatarURL({ format: 'png', size: 256 })), 352, 2, 146, 146)

    interaction.reply({ files: [{ attachment: ctx.canvas.toBuffer(), name: `lovecalc.png` }] })
  },
}
