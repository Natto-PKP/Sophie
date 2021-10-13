const unknow_text = '`Espèce inconnue`'

module.exports = {
  option: { type: 'SUB_COMMAND', name: 'fishs', description: 'Contemplez votre collection de créatures marines', options: [{ type: 'STRING', name: 'fish', description: 'Sélectionnez un poisson en particulier' }] },

  /**
   * @param { import('../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, databases: { items }, interaction }) => {
    const target = interaction.options.getString('fish')

    if (target) {
      const [fish] = await items.query(`SELECT fishs.event, fishs.name, fishs.description, fishs.golds, fishs.tickets, indexes.amount FROM items.fishs AS fishs INNER JOIN users.indexes AS indexes ON "${interaction.user.id}" = indexes.id AND fishs.id = indexes.item WHERE fishs.name LIKE "${target}%";`).catch(() => [])

      if (fish) {
        const embed = { color: client.colors.default, author: { name: `${['🐟', '🐠', '🐡', '🦈'].random()} ${fish.name} • Détails` }, description: `**\`` }
        if (fish.golds) embed.description += `${fish.golds.form()}💴`
        if (fish.tickets) embed.description += ` - ${fish.tickets}🧧`
        if (fish.event) embed.footer = { text: `Seulement obtenable pendant: ${{}[fish.event]}` }
        embed.description += ` | \`** ${fish.description}`
        interaction.reply({ embeds: [embed] })
      } else interaction.error({ content: "Vous n'avez pas encore découvert cette espèce" })
    } else {
      const fishs = await items.query(`SELECT fishs.name, indexes.amount FROM items.fishs AS fishs LEFT JOIN users.indexes AS indexes ON "${interaction.user.id}" = indexes.id AND fishs.id = indexes.item ORDER BY probability DESC;`)

      const table = []
      for (let i = 0, l = fishs.length, y = 0; i < l; i++) {
        const text = fishs[i].amount ? `\`${fishs[i].amount.form()}x\` ${fishs[i].name}` : unknow_text
        table[y] ? (table[y].length > 9 ? table.push([text]) && ++y : table[y].push(text)) : table.push([text])
      }

      if (table.flat().some(text => text != unknow_text)) {
        interaction.reply({
          embeds: [
            {
              color: client.colors.default,
              author: { name: `Vous connaissez ${fishs.filter(item => item.amount).length} espèces.`, icon_url: interaction.user.displayAvatarURL({ dynamic: true }) },
              fields: table.map(value => ({ name: '\u200B', value: value.join('\n'), inline: true })),
              footer: { text: `${fishs.reduce((acc, { amount }) => (acc += amount || 0), 0).form()} poissons attrapés` },
            },
          ],
        })
      } else interaction.error({ content: 'Commencez la pêche afin de voir les poissons que vous avez obtenus' })
    }
  },
}
