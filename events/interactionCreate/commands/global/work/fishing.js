const images = ['https://i.imgur.com/JDiBUeY.png', 'https://i.imgur.com/V8tqdoW.png', 'https://i.imgur.com/gS7ozAK.png']
const cooldowns = {}

module.exports = {
  option: { type: 'SUB_COMMAND', name: 'fishing', description: 'Vous pourrez revendre ce que vous péchez avec un peu de chance' },

  /**
   * @param { import('../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, databases, interaction }) => {
    if (![0, 6].includes(new Date().getDay())) return interaction.reply({ content: `🎣 **\`| \`** La pêche n'est disponible que les week-ends`, ephemeral: true })
    if (cooldowns[interaction.user.id] && cooldowns[interaction.user.id] - Date.now() > 0) return interaction.reply({ content: "**`⏳ | `** Vous n'avez pas encore de nouvelle prise", ephemeral: true })

    const items = await databases.items.query('SELECT id, name, golds, tickets, probability FROM fishs ORDER BY probability DESC;')
    const [user = {}] = await databases.users.query(`SELECT tickets, golds, fishing_rod, looting, chance FROM users.economies LEFT JOIN users.equipments ON users.economies.id = users.equipments.id LEFT JOIN items.equipments ON users.equipments.fishing_rod = items.equipments.id WHERE users.economies.id = "${interaction.user.id}";`).catch(() => [])
    Object.resolve(user, { tickets: 0, golds: 0, cooldown: 0, fishing_rod: 'default' })

    const drops = { fishs: [] }
    items.probabilities({ length: user.fishing_rod == 'default' ? (Math.random() > 0.3 ? 1 : 0) : Math.ceil(user.looting / 2) + Math.round(Math.random() * Math.floor(user.looting / 2)), bonus: user.chance ? user.chance / 100 : 0 }).forEach(item => drops[item.id.split('-')[0] + 's'].push(item))
    //Math.round(Math.random()) * Math.floor(user.looting / 2) + Math.ceil(user.looting / 2)
    user.tickets += [...drops.fishs].reduce((acc, item) => (item.tickets ?? 0) + acc, 0)
    user.golds += [...drops.fishs].reduce((acc, item) => (item.golds ?? 0) + acc, 0)
    cooldowns[interaction.user.id] = Date.now() + 6e4 * (Math.round(Math.random() * 2) + 10 - user.cooldown)

    databases.users.query(`INSERT INTO economies (id, tickets, golds) VALUES ("${interaction.user.id}", ${user.tickets}, ${user.golds}) ON DUPLICATE KEY UPDATE tickets = ${user.tickets}, golds = ${user.golds};`)
    databases.users.query(`SELECT item, amount FROM indexes WHERE id = "${interaction.user.id}";`).then((indexes = []) => {
      for (const item of Object.values(drops).flat()) {
        const index = indexes.find(i => i.item == item.id)
        if (!index) {
          databases.users.query(`INSERT INTO indexes (id, item, amount, type) VALUES ("${interaction.user.id}", "${item.id}", 1, "${item.id.split('-')[0] + 's'}")`)
          item.own = true
        } else databases.users.query(`UPDATE indexes SET amount = ${index.amount + 1} WHERE id = "${interaction.user.id}" AND item = "${item.id}";`)
      }

      const drops_flat = Object.values(drops).flat()
      const embed = { color: client.colors.default, author: { name: drops_flat.length ? `Vous avez eu ${drops_flat.length} prise(s) durant cette instant de pêche` : "Vous n'avez rien obtenu...", icon_url: interaction.user.displayAvatarURL({ dynamic: true }) }, image: { url: drops_flat.length ? images.random() : null } }
      if (drops_flat.length) embed.description = `🐟 **\`| Obtenu(s):\`**\n\n${drops_flat.map(item => `•${item.own ? ' `nouveau`' : ''} ${item.name} ${item.golds ? `\`+${item.golds.form()}💴\`` : ''}${item.tickets ? `\`+${item.tickets}🧧\`` : ''}`).join('\n')}`
      interaction.reply({ embeds: [embed] })
    })
  },
}

setTimeout(() => {
  for (const key in cooldowns) if (cooldowns[key] - Date.now() > 0) delete cooldowns[key]
}, 144e5)
