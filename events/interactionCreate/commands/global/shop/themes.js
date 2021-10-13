module.exports = {
  option: {
    type: 'SUB_COMMAND',
    name: 'themes',
    description: 'Achetez vous un nouveau fond de profile',
    options: [
      { type: 'STRING', name: 'tags', description: 'Filtrez les résultats par tags' },
      { type: 'STRING', name: 'name', description: 'Filtrez les résultats par nom' },
      { type: 'STRING', name: 'character', description: 'Filtrez les résultats par personnage' },
    ],
  },

  /**
   * @param { import('../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, databases: { users, items }, interaction, options, global_interactions }) => {
    const wallpapers = await items.query(`SELECT wallpapers.id, IF (wallpapers.id IN (SELECT wallpaper FROM users.wallpapers WHERE users.wallpapers.id = "${interaction.user.id}"), 1, 0) AS own, url, description, extra, tags, color, tickets, golds 
    FROM items.wallpapers AS wallpapers LEFT JOIN items.prices AS prices ON wallpapers.tier = prices.tier AND prices.type = "wallpapers";`)

    /* Filtrage */
    if (options?.length) {
      const arr = []
      for (let i = 0, l = wallpapers.length; i < l; i++) {
        const wallpaper = wallpapers[i]
        options.forEach(({ name, value }) => {
          const property = wallpaper[{ tags: 'tags', name: 'description', character: 'extra' }[name]]
          if (typeof property != 'undefined') (name == 'tags' ? property && value.split(/\s+/).every(key => BigInt(wallpaper.tags).has(key, 'wallpapers')) : property.includes(value)) && arr.push(wallpaper)
        })
      }
      wallpapers = arr
    }

    if (wallpapers.length) {
      const [user] = await users.query(`SELECT golds, tickets, flags FROM economies LEFT JOIN profiles ON "${interaction.user.id}" = profiles.id WHERE economies.id = "${interaction.user.id}";`).catch(() => [])
      Object.resolve(user, { golds: 0, tickets: 0 })

      /**
       * @param { number } index
       * @returns { color: string, description: string, author: { name: string }, image: { url: string }, fields: { name: string, value: string, inline: boolean }[], footer: { text: string } }
       */
      const view = (index = 0) => {
        const wallpaper = wallpapers[index]
        const embed = {
          color: wallpaper.color,
          author: { name: `🎨 ${wallpaper.own ? '[Acheter]' : ''} ${wallpaper.description}` },
          description: `**\`🔖 Tags:\`** ${wallpaper.tags ? `\`${BigInt(wallpaper.tags).resolve('wallpapers').join('` `')}\`` : "Ce thème n'a pas de tag"}`,
          image: { url: wallpaper.url },
          fields: [],
          footer: { text: `${user.tickets.form()} 🧧 • ${user.golds.form()} 💴` },
        }

        if (wallpaper.extra) embed.description += `\n**\`📌 Caractère:\` ${wallpaper.extra}**`
        if (wallpaper.golds) embed.fields.push({ name: '\u200B', value: `**\`${wallpaper.golds.form()} 💴\`** yens`, inline: true })
        if (wallpaper.tickets) embed.fields.push({ name: '\u200B', value: `**\`${wallpaper.tickets} 🧧\`** tickets`, inline: true })
        if (wallpapers.length > 1) embed.footer.text += ` • ${index + 1} sur ${wallpapers.length}`
        return embed
      }

      const components =
        wallpapers.length > 1
          ? [
              { type: 'ACTION_ROW', components: [global_interactions.select_menu] },
              { type: 'ACTION_ROW', components: [global_interactions.buttons.previous, global_interactions.buttons.buy, global_interactions.buttons.close, global_interactions.buttons.next] },
            ]
          : [{ type: 'ACTION_ROW', components: [global_interactions.buttons.buy, global_interactions.buttons.close] }]

      interaction.reply({ embeds: [view()], components, fetchReply: true }).then(menu => {
        const collector = menu.createMessageComponentCollector({ filter: i => i.user.id == interaction.user.id, idle: 15e4 })

        let page = 0
        collector.on('collect', component => {
          const ID = component.customId

          if (ID == 'shop-previous') component.update({ embeds: [view(wallpapers[page - 1] ? --page : (page = wallpapers.length - 1))] })
          else if (ID == 'shop-next') component.update({ embeds: [view(wallpapers[page + 1] ? ++page : (page = 0))] })
          else if (ID == 'shop-buy') {
            const wallpaper = wallpapers[page]

            if (wallpaper.own || wallpaper.id == 'default') component.error({ content: 'Vous possédez déjà ce fond' })
            else if (BigInt(wallpaper.tags).has('premium', 'wallpapers') && !BigInt(user.flags).has('premium', 'users')) component.error({ content: "Vous n'êtes pas un utilisateur premium, il est possible de l'être gratuitement" })
            else if (wallpaper.tickets > user.tickets) component.error({ content: `Vous n'avez pas assez de tickets, il vous manque \`${wallpaper.tickets - user.tickets} 🧧\` tickets` })
            else if (wallpaper.golds > user.golds) component.error({ content: `Vous n'avez pas assez de yens, il vous manque \`${wallpaper.golds - user.golds} 💴\` yens` })
            else {
              ++wallpaper.own
              user.golds -= wallpaper.golds ?? 0
              user.tickets -= wallpaper.tickets ?? 0

              users.query(`INSERT INTO wallpapers (id, wallpaper) VALUES ("${interaction.user.id}", "${wallpaper.id}")`)
              users.query(`INSERT INTO economies (id, tickets, golds) VALUES ("${interaction.user.id}", ${user.tickets}, ${user.golds}) ON DUPLICATE KEY UPDATE tickets = ${user.tickets}, golds = ${user.golds};`)
              component.update({ embeds: [view(page)] })
            }
          } else if (ID == 'shop-order') {
            const [value] = component.values

            if (value == 'up') wallpapers.sort((a, b) => (a.tickets ?? 0) - (b.tickets ?? 0) || (a.golds ?? 0 - b.golds ?? 0))
            else if (value == 'down') wallpapers.sort((a, b) => (b.tickets ?? 0) - (a.tickets ?? 0) || (b.golds ?? 0 - a.golds ?? 0))
            component.update({ embeds: [view((page = 0))] })
          } else if (ID == 'shop-close') collector.stop('close')
        })

        collector.on('end', (_, reason) => {
          if (reason == 'idle') menu.edit({ embeds: [{ color: client.colors.default, description: "Vous avez quitté la boutique pour cause d'inactivité." }], components: [] })
          else if (reason == 'close') menu.edit({ embeds: [{ color: client.colors.default, description: `Merci de votre visite ${interaction.user}, revenez vite nous voir !` }], components: [] })
        })
      })
    } else interaction.error({ content: "Aucun résultat n'a été trouver avec les filtres actuels." })
  },
}
