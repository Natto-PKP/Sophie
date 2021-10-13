const flags = require('../../../../../../structures/flags').commands
const names = require('../../../../../../structures/names.json').commands

module.exports = {
  option: { type: 'SUB_COMMAND', name: 'enable', description: 'Activer certaines commandes sur votre serveur', options: [{ name: 'command', description: 'Sélectionner la commande à activer', type: 'STRING', required: true, choices: Object.entries(names).map(([value, name]) => ({ name, value })) }] },

  /**
   * @param { import('../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: async ({ databases: { guilds }, interaction }) => {
    const [guild = {}] = await guilds.query(`SELECT commands FROM features WHERE id = "${interaction.guild.id}";`)
    Object.resolve(guild, { commands: 0 })

    const command = interaction.options.getString('command', true)

    if (!BigInt(guild.commands).has(flags[command], 'commands')) {
      if ((await interaction.guild.commands.fetch()).size < 100) {
        const commands = Number(BigInt(guild.commands) | flags[command])

        interaction.guild.commands.create(require(`../../../features/${command}.js`).body).then(
          () => {
            guilds.query(`INSERT INTO features (id, commands) VALUES ("${interaction.guildId}", ${commands}) ON DUPLICATE KEY UPDATE commands = ${commands};`)
            interaction.reply({ content: `**\`| \`** La commande **${names[command]}** vient d'être activée sur cette guilde` })
          },
          error => interaction.error({ content: "Une erreur est survenue, la commande n'a pas pu être activée", log: true, error })
        )
      } else interaction.error({ content: 'Votre guilde possède déjà le nombre maximum de commandes' })
    } else interaction.error({ content: 'Cette commande est déjà active sur votre guilde' })
  },
}
