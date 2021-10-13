module.exports = {
  body: { name: 'raw-content', type: 'MESSAGE' },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ interaction }) => {
    const message = interaction.options.getMessage('message')

    if (message.content.length) interaction.reply({ content: `${message.content.replace(/`|\*|\|\||_|~|>/g, str => `\\${str}`)}`, ephemeral: true })
    else interaction.error({ content: 'Ce message ne possède pas de contenu' })
  },
}
