const { Client, Interaction } = require('discord.js')
const commands = require('../../structures/commands')
const { readdirSync } = require('fs')

// Chargements des interactions
const interactions = {
  buttons: readdirSync('./events/interactionCreate/buttons').map(file => require(`./buttons/${file}`)),
  select_menus: readdirSync('./events/interactionCreate/select_menus').map(file => require(`./select_menus/${file}`)),
}

/**
 * @param { { client: Client, databases: import('../../structures/typing').Databases, params: [Interaction] } } param0
 */
module.exports = async ({ client, databases, params: [interaction] }) => {
  const type = interaction.isContextMenu() ? 'context_menus' : interaction.isCommand() ? 'commands' : interaction.isButton() ? 'buttons' : interaction.isSelectMenu() ? 'select_menus' : null

  if (type) {
    if (type == 'commands' || type == 'context_menus') {
      /* Get command */
      const command = await commands.get({ name: interaction.commandName, guildId: interaction.guildId, context_menu: type == 'context_menus' ? interaction.targetType : null })
      if (!command) return interaction.error({ content: "Cette commande n'est pas ou plus disponible pour le moment" })

      /* Check if user is blacklist */
      const [user_blacklist] = await databases.users.query(`SELECT reason, date FROM blacklist WHERE id = "${interaction.user.id}";`).catch(() => [])
      if (user_blacklist) return interaction.reply({ content: `**\`🛑 | \`** Vous êtes blacklist depuis \`${new Date(user_blacklist.date).form('DD/MM/YYYY hh:mm')}\`\n**•** Raison(s): ${user_blacklist.reason}` })

      /* Check if this command is in guild */
      if (interaction.guildId) {
        /* Check if this guild is blacklist */
        const [guild = {}] = await databases.guilds.query(`SELECT reason, date, commands FROM blacklist LEFT JOIN features ON features.id = "${interaction.guildId}" WHERE blacklist.id = "${interaction.guildId}";`).catch(() => [])
        if (guild.reason) return interaction.reply({ content: `**\`🛑 | \`** Cette guilde est blacklist depuis \`${new Date(guild.date).form('DD/MM/YYYY hh:mm')}\`\n**•** Raison(s): ${guild.reason}` })
        Object.resolve(guild, { commands: 0 })

        /* Check basic permissions */
        if (!interaction.channel.permissionsFor(interaction.guild.me).any((1n << 11n) | (1n << 31n))) return
        if (!interaction.channel.permissionsFor(interaction.member).any((1n << 11n) | (1n << 31n))) return interaction.error({ content: "Vous n'avez pas l'autorisation d'utiliser des commandes dans ce salon" })

        /* Check command permissions */
        if (command.options && command.options.permissions) {
          if (command.options.permissions.member && interaction.member.permissions.missing(command.options.permissions.member).length) return interaction.reply({ content: "**`🧶 | `** Vous n'avez pas les permissions pour utiliser cette commande", ephemeral: true })
          if (command.options.permissions.client) {
            if (interaction.channel.permissionsFor(interaction.guild.me).missing(command.options.permissions.client).length) return interaction.reply({ content: `**\`🧶 | \`** Nous n'avons pas les permissions pour répondre à cette commande dans ${interaction.channel}`, ephemeral: true })
            if (interaction.guild.me.permissions.missing(command.options.permissions.client).length) return interaction.reply({ content: "**`🧶 | `** Nous n'avons pas les permissions pour répondre à cette commande", ephemeral: true })
          }
        }

        /* Command exec */
        command.execute({ client, databases, interaction })
      } else command.options?.guild ? interaction.error({ content: "Cette commande n'est disponible que dans une guilde" }) : command.execute({ client, databases, interaction })
    } else interactions[type].find(({ body }) => body.customId == interaction.customId)?.execute({ client, databases, interaction })

    /* COUNTERS */
    const amount = interaction.guildId ? 'guild' : 'global'
    databases.counters.query(`INSERT INTO ${type} (id, ${amount}) VALUES ("${interaction.commandName || interaction.customId}", 1) ON DUPLICATE KEY UPDATE ${amount} = ${amount} + 1;`).catch(() => null)
  }
}
