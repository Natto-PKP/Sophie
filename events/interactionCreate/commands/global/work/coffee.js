const images = ['https://i.imgur.com/xlhKSK1.png', 'https://i.imgur.com/c0k7cMM.png', 'https://i.imgur.com/vTFZuMJ.png', 'https://i.imgur.com/rxX4tDv.png', 'https://i.imgur.com/oCKyEE2.png']

module.exports = {
  option: { type: 'SUB_COMMAND', name: 'coffee', description: 'Travailez dans un petit café avec un salaire fixe' },

  /**
   * @param { import('../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, databases: { users }, interaction }) => {
    const [user = {}] = await users.query(`SELECT level, points, cooldown, golds FROM economies LEFT JOIN works ON economies.id = works.id AND "coffee" = works.type WHERE economies.id = "${interaction.user.id}";`).catch(() => [])
    Object.resolve(user, { level: 0, points: 0, golds: 0 })

    if (user.cooldown && new Date(user.cooldown).format('DDMMYYYY') == new Date().format('DDMMYYYY')) return interaction.reply({ content: "**`⏳ | `** Vous avez déjà travaillé aujourd'hui, reposez vous un peu...", ephemeral: true })

    const rewards = { gains: user.level * 5 + 90, bonus: Math.random() > 0.8 ? Math.ceil(Math.random() * 35) + 5 : 0, points: Math.round(Math.random()) + 1 }
    const embed = { color: client.colors.default, author: { name: '☕ Vous avez travaillé quelques heures dans un café' }, description: `\`| \` Vous obtenez \`${rewards.gains} 💴\``, thumbnail: { url: images.random() } }
    if (rewards.bonus) embed.description += ` **+** \`${rewards.bonus} 💴\``

    const req = () => user.level * 15 || 5
    if ((user.points += rewards.points) >= req()) {
      user.points -= req()
      ++user.level
    }

    user.golds += rewards.gains + rewards.bonus
    users.query(`INSERT INTO economies (id, golds) VALUES ("${interaction.user.id}", ${user.golds}) ON DUPLICATE KEY UPDATE golds = ${user.golds};`)
    users.query(`INSERT INTO works (id, cooldown, level, points, type) VALUES ("${interaction.user.id}", ${Date.now()}, ${user.level}, ${user.points}, "coffee") ON DUPLICATE KEY UPDATE cooldown = ${Date.now()}, level = ${user.level}, points = ${user.points};`)
    embed.description += `\n\n**niv.** ${user.level ?? 0} \` ${user.points.bar({ total: user.level * 15 || 5, size: 14 })} | ${user.points.form()} / ${req().form()}\` **points**`
    interaction.reply({ embeds: [embed] })
  },
}
