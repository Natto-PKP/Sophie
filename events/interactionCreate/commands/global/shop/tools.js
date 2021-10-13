const tools_order = { fishing_rod: 0 }
const names = { fishs: 'poissons' }

// Interactions
const components = [
  {
    type: 'ACTION_ROW',
    components: [
      {
        type: 'SELECT_MENU',
        customId: 'select-tools',
        placeholder: 'Améliorer un des équipements',
        options: [{ label: 'Âméliorer la canne à pêche', emoji: '🎣', value: 'fishing_rod' }],
      },
    ],
  },
  { type: 'ACTION_ROW', components: [{ type: 'BUTTON', customId: 'close-tools', style: 'DANGER', emoji: '🛑', label: "Fermer la boutique d'équipements" }] },
]

module.exports = {
  option: { type: 'SUB_COMMAND', name: 'tools', description: 'Achetez vous de nouveaux outils' },

  /**
   * @param { import('../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, databases, interaction }) => {
    const tools = await databases.items.query("SELECT equipments.id, name, looting, chance, cooldown, required, equipments.tier, equipments.type, golds, tickets FROM equipments INNER JOIN prices ON equipments.tier = prices.tier AND 'equipments' = prices.type ORDER BY equipments.tier")

    const equipments = [[]]
    for (let i = 0, l = tools.length; i < l; i++) equipments[tools_order[tools[i].type]].push(tools[i])

    const items = await databases.items.query(`SELECT items.id, name, amount, indexes.type FROM items.fishs AS items LEFT JOIN users.indexes AS indexes ON "${interaction.user.id}" = indexes.id AND items.id = indexes.item;`).catch(() => [])
    const [user = {}] = await databases.users.query(`SELECT golds, tickets, equipments.fishing_rod FROM economies LEFT JOIN equipments ON economies.id = equipments.id WHERE economies.id = "${interaction.user.id}";`).catch(() => [])
    Object.resolve(user, { golds: 0, tickets: 0, fishing_rod: 'default' })
    user.equipments = [user.fishing_rod]

    const required = equipment => {
      const results = [[], []]
      for (const [key, value] of Object.entries(JSON.parse(equipment.required))) {
        const item = items.find(obj => obj.id == key)

        if (item) value > (item.amount ?? 0) ? results[0].push(`\`${(item.amount ?? 0).form()}/${value.form()}\` ${item.name}`) : results[1].push(`✔ \`${value.form()}/${value.form()}\` ${item.name}`)
        else {
          const total = items.filter(({ type }) => key == type).reduce((acc, { amount }) => (acc += amount ?? 0), 0)
          value > total ? results[0].push(`\`${total.form()}/${value.form()}\` ${names[key]}`) : results[1].push(`✔ \`${value.form()}/${value.form()}\` ${names[key]}`)
        }
      }

      return results
    }

    const view = () => ({
      color: client.colors.default,
      author: { name: "🧰 Boutique d'équipements", icon_url: interaction.user.displayAvatarURL({ dynamic: true }) },
      description: "**`🔓 | `** Les équipements doivent être débloquer avant d'être acheter\n\u200B",
      footer: { text: `${user.tickets.form()} 🧧 • ${user.golds.form()} 💴` },
      fields: equipments.map(category => {
        const index = category.findIndex(equipment => user.equipments.includes(equipment.id)) ?? 0
        const equipment = category[index + 1] || category[index]

        const field = { name: `${user.equipments.includes(equipment.id) ? '`[MAX]` ' : ''}${{ fishing_rod: '🎣' }[equipment.type]} ${equipment.name}`, inline: true }

        if (!user.equipments.includes(equipment.id)) {
          const [lock, unlock] = required(equipment)

          if (!lock.length) {
            field.value = `>>> ||\`| Déblocage\`|| > Achat •\n\n`

            if (equipment.golds) field.value += `**-** \`${equipment.golds.form()}\` yens 💴\n`
            if (equipment.tickets) field.value += `**-** \`${equipment.tickets.form()}\` tickets 🧧\n`
          } else field.value = `>>> • Déblocage > ||\`Achat |\`||\n\n${[...unlock, ...lock].join('\n')}\n`

          field.value += '➖➖➖➖➖➖➖➖\n'
        } else field.value = '`Outil au niveau maximum` '

        field.value += '• Statistique(s)\n\n'
        if (equipment.looting) field.value += `\`🎰 |\` ${equipment.looting > 1 ? `Entre ${Math.floor(equipment.looting / 2)} et ${equipment.looting} drops` : 'Au moins un drop'}\n`
        if (equipment.chance) field.value += `\`✨ |\` + ${equipment.chance}% de chance`
        if (equipment.cooldown) field.value += `\`⏳ |\` - ${equipment.cooldown}min de cooldown`

        return field
      }),
    })

    interaction.reply({ embeds: [view()], components, fetchReply: true }).then(menu => {
      const collector = menu.createMessageComponentCollector({ filter: i => i.user.id == interaction.user.id, idle: 15e4 })

      collector.on('collect', component => {
        const ID = component.customId

        if (ID == 'select-tools') {
          const equipment = equipments[tools_order[component.values[0]]][equipments[tools_order[component.values[0]]].findIndex(i => user.equipments.includes(i.id)) + 1]

          if (equipment) {
            if (!required(equipment)[0].length) {
              if (equipment.tickets > user.tickets) return component.error({ content: "Vous n'avez pas assez de tickets." })
              if (equipment.golds > user.golds) return component.error({ content: "Vous n'avez pas assez de yens." })

              databases.users.query(`UPDATE economies SET tickets = ${(user.tickets -= equipment.tickets)}, golds = ${(user.golds -= equipment.golds)} WHERE id = "${interaction.user.id}";`)
              databases.users.query(`UPDATE equipments SET ${component.values[0]} = "${(user.equipments[tools_order[component.values[0]]] = equipment.id)}" WHERE id = "${interaction.user.id}";`)
              component.update({ embeds: [view()] })
            } else component.error({ content: "Vous n'avez pas encore débloquer cet outil." })
          } else component.error({ content: 'Votre outil est déjà au niveau maximum' })
        } else if (ID == 'close-tools') collector.stop('close')
      })

      collector.on('end', (_, reason) => {
        if (reason == 'idle') menu.edit({ embeds: [{ color: client.colors.default, description: "Vous avez quitté la boutique pour cause d'inactivité." }], components: [] })
        else if (reason == 'close') menu.edit({ embeds: [{ color: client.colors.default, description: `Merci de votre visite ${interaction.user}, revenez vite nous voir !` }], components: [] })
      })
    })
  },
}
