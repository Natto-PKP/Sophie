module.exports = {
  body: {
    type: 'BUTTON',
    customId: 'support-rules-check',
    style: 'SUCCESS',
    emoji: '✔',
    label: 'Je respecte vos règles et conditions.',
  },

  /**
   * @param { import('../../../structures/typing').Params<'button'> } param0
   */
  execute: ({ interaction }) => {
    if (!interaction.member.roles.cache.get('815229896468594728')) {
      interaction.member.roles.add('815229896468594728')
      interaction.reply({ content: 'Bienvenue dans notre maison, soyez gentils avec les autres !', ephemeral: true })
    }
  },
}
