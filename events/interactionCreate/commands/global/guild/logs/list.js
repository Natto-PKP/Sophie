const names = require('../../../../../../structures/names.json').logs

module.exports = {
  option: { type: 'SUB_COMMAND', name: 'list', description: 'La liste des logs activés' },

  /**
   * @param { import('../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, interaction, databases: { guilds } }) => {
    const logs = await guilds.query(
      `SELECT logs.type, channel, wallpapers.name AS image, display FROM logs 
      LEFT JOIN logs_extra AS ex ON ex.guild = "${interaction.guildId}" AND ex.type = logs.type 
      LEFT JOIN items.guild_wallpapers AS wallpapers ON IF(ex.image, ex.image, 'default') = wallpapers.id
      WHERE logs.guild = "${interaction.guildId}";`
    )

    if (logs.length) {
      const [_basics, _advanceds] = logs.partition(log => !['join', 'leave'].includes(log.type))
      const [basics, advanceds] = [[[]], []]

      /* Basic log */
      let i = 0
      for await (const log of _basics) {
        const channel = await interaction.guild.channels.fetch(log.channel).catch(() => null)
        if (basics[i].length == 3) {
          basics.push([{ type: log.type, channel }])
          i++
        } else basics[i].push({ type: log.type, channel })
      }

      /* Advanced logs */
      for await (const log of _advanceds) {
        Object.resolve(log, { display: 'canvas' })
        const channel = await interaction.guild.channels.fetch(log.channel).catch(() => null)
        const field = { name: `\u200B`, value: `**\`| ${names[log.type]} \`** ${channel || '`Aucun salon`'}` }
        if (log.display == 'canvas') field.value += `\n> 🎨 • **${log.image}**`
        advanceds.push(field)
      }

      const embed = { color: client.colors.default, author: { name: '📋 • Logs actifs sur votre serveur' }, fields: [] }
      if (basics.flat().length) embed.fields.push(...basics.map(group => ({ name: '\u200B', value: group.map(({ type, channel = '`Aucun salon`' }) => `> **• ${names[type]}**\n> ${channel}`).join('\n\n'), inline: true })))
      if (advanceds.length) embed.fields.push(...advanceds)
      interaction.reply({ embeds: [embed] })
    } else interaction.error({ content: "Aucun log n'est activé sur votre serveur" })
  },
}
