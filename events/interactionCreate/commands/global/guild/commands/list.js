const names = require('../../../../../../structures/names.json').commands

module.exports = {
  option: { type: 'SUB_COMMAND', name: 'list', description: 'La liste des commandes disponibles' },

  /**
   * @param { import('../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ client, interaction, databases: { guilds } }) => {
    const [guild = {}] = await guilds.query(`SELECT commands FROM features WHERE id = "${interaction.guild.id}";`)
    const own_commands = BigInt(Object.resolve(guild, { commands: 0 }).commands).resolve('commands')

    if (own_commands.length) interaction.reply({ embeds: [{ color: client.colors.default, author: { name: 'Liste des commandes actives sur cette guilde', icon_url: interaction.guild.iconURL({ dynamic: true }) }, description: `**•** \`${own_commands.map(cmd => names[cmd]).join('`\n**•** `')}\`` }] })
    else interaction.error({ content: "Aucune commande n'est activée sur votre guilde" })
  },
}
