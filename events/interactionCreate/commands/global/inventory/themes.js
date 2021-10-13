const { buttons, select_menu } = {
  buttons: {
    previous: { type: 'BUTTON', customId: 'inventory-previous', style: 'SECONDARY', emoji: '⬅' },
    next: { type: 'BUTTON', customId: 'inventory-next', style: 'SECONDARY', emoji: '➡' },
    close: { type: 'BUTTON', customId: 'inventory-close', style: 'DANGER', label: 'Quitter' },
    equip: { type: 'BUTTON', customId: 'inventory-equip', style: 'SUCCESS', label: 'Appliquer pour toutes', emoji: '🖼' },
  },
  select_menu: {
    type: 'SELECT_MENU',
    customId: 'inventory-specific-equip',
    placeholder: 'Appliquer le thème à des interfaces spécifiques',
    options: [{ label: "Appliquer à l'interface 'profile'", value: 'profiles', emoji: '👀' }],
    maxValues: 1,
  },
}

module.exports = {
  option: {
    type: 'SUB_COMMAND',
    name: 'themes',
    description: 'Changez les thèmes de certaines de vos commandes',
    options: [
      { type: 'STRING', name: 'tags', description: 'Filtrez les résultats par tags' },
      { type: 'STRING', name: 'name', description: 'Filtrez les résultats par nom' },
      { type: 'STRING', name: 'character', description: 'Filtrez les résultats par personnage' },
    ],
  },

  /**
   * @param { import('../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, databases: { users, items }, interaction, options }) => {
    const wallpapers = await items.query(
      `SELECT IF (pfl.wallpaper = wallpapers.id, 1, 0) AS profiles, wallpapers.id, url, description, extra, tags, color FROM items.wallpapers AS wallpapers
      LEFT JOIN users.profiles AS pfl ON pfl.id = "${interaction.user.id}"
      WHERE wallpapers.id IN (SELECT wallpaper FROM users.wallpapers WHERE users.wallpapers.id = "${interaction.user.id}") OR wallpapers.id = "default";`
    )

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
      if (wallpapers.length > 1) {
        /**
         * Interface
         * @param { number } index
         * @returns { { color: string, description: string, author: { name: string }, image: { url: string }, footer: { text: string } } }
         */
        const view = (index = 0) => {
          const wallpaper = wallpapers[index]
          const arr_actives = [['profile', wallpaper.profiles]]
          const current_actives = arr_actives.filter(command => command[1])
          const embed = { color: wallpaper.color, description: `**\`🔖 Tags:\`** ${wallpaper.tags ? `\`${BigInt(wallpaper.tags).resolve('wallpapers').join('` `')}\`` : "Ce thème n'a pas de tag"}`, author: { name: `🎨 ${wallpaper.description}` }, image: { url: wallpaper.url }, footer: { text: '' } }

          if (wallpaper.extra) embed.description += `\n**\`📌 Caractère:\` ${wallpaper.extra}**`
          if (current_actives.length) embed.footer.text += `${current_actives.length == arr_actives.length ? 'Appliqué partout' : `Appliqué sur les interfaces: ${current_actives.map(([key]) => key).join(' ')}`} • `
          embed.footer.text += `${index + 1} sur ${wallpapers.length}`

          return embed
        }

        const components = [
          { type: 'ACTION_ROW', components: wallpapers.length > 1 ? [buttons.previous, buttons.equip, buttons.close, buttons.next] : [buttons.equip, buttons.close] },
          { type: 'ACTION_ROW', components: [select_menu] },
        ]

        interaction.reply({ embeds: [view(0)], components: wallpapers.length > 1 ? components : components.reverse(), fetchReply: true }).then(menu => {
          const collector = menu.createMessageComponentCollector({ filter: i => i.user.id == interaction.user.id, idle: 15e4 })

          let page = 0
          collector.on('collect', component => {
            const ID = component.customId

            if (ID == 'inventory-previous') component.update({ embeds: [view(wallpapers[page - 1] ? --page : (page = wallpapers.length - 1))] })
            else if (ID == 'inventory-next') component.update({ embeds: [view(wallpapers[page + 1] ? ++page : (page = 0))] })
            else if (ID == 'inventory-equip') {
              const wallpaper = wallpapers[page]

              for (const key of ['profiles']) {
                if (wallpaper[key]) continue
                const last_wallpaper = wallpapers.find(item => item[key])
                if (last_wallpaper) last_wallpaper[key] = 0
                users.query(`INSERT INTO ${key} (id, wallpaper) VALUES ("${interaction.user.id}", "${wallpaper.id}") ON DUPLICATE KEY UPDATE wallpaper = "${wallpaper.id}";`)
                wallpaper[key] = 1
              }
              component.update({ embeds: [view(page)] })
            } else if (ID == 'inventory-specific-equip') {
              const wallpaper = wallpapers[page]

              for (const key of component.values) {
                if (wallpaper[key]) continue
                const last_wallpaper = wallpapers.find(item => item[key])
                if (last_wallpaper) last_wallpaper[key] = 0
                users.query(`INSERT INTO ${key} (id, wallpaper) VALUES ("${interaction.user.id}", "${wallpaper.id}") ON DUPLICATE KEY UPDATE wallpaper = "${wallpaper.id}";`)
                wallpaper[key] = 1
              }
              component.update({ embeds: [view(page)] })
            } else if (ID == 'inventory-close') collector.stop('close')
          })

          collector.on('end', (_, reason) => {
            if (reason == 'close') menu.edit({ embeds: [{ color: client.colors.default, description: `Vous avez fermé votre inventaire !` }], components: [] })
            if (reason == 'idle') menu.edit({ embeds: [{ color: client.colors.default, description: "Vous avez quitté votre inventaire pour cause d'inactivité." }], components: [] })
          })
        })
      } else {
        const wallpaper = wallpapers[0]
        interaction.reply({ embeds: [{ color: wallpaper.color, description: `**\`🔖 Tags:\`** ${wallpaper.tags ? `\`${BigInt(wallpaper.tags).resolve('wallpapers').join('` `')}\`` : "Ce thème n'a pas de tag"}`, author: { name: `🎨 ${wallpaper.description}` }, image: { url: wallpaper.url }, footer: { text: 'Appliqué partout' } }] })
      }
    } else interaction.error({ content: "Aucun résultat n'a été trouver avec les filtres actuels." })
  },
}
