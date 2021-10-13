module.exports = {
  body: { name: 'avatar', description: "Regardez de près l'avatar d'un utilisateur.", options: [{ type: 'USER', name: 'user', description: 'Sélectionnez un utilisateur en particulier.' }] },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ client, interaction }) => {
    const user = interaction.options.getUser('user') || interaction.user
    const avatar = user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })

    if (interaction.guildId) interaction.reply({ embeds: [{ color: client.colors.default, description: `📸 Tenez, l'[avatar](${avatar}, 'cliquez ici pour l'afficher sur votre navigateur') de ${user}`, image: { url: avatar } }] })
    else interaction.reply({ content: `Tenez, l'[avatar](${avatar}, 'cliquez ici pour l'afficher sur votre navigateur') de ${user}`, files: [{ attachment: avatar, name: `avatar.${user.avatar.startsWith('a_') ? 'gif' : 'png'}` }] })
  },
}
