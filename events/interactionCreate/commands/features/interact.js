const sources = require('../../../../structures/interacts.json')

module.exports = {
  body: {
    name: 'interact',
    description: 'Intéragissez avec les autres membres du serveur',
    options: [
      { type: 'STRING', name: 'action', description: "Sélectionnez l'interaction à faire", choices: Object.entries(sources).map(([value, { name }]) => ({ name, value })), required: true },
      { type: 'USER', name: 'member', description: 'Sélectionnez un membre en particulier.' },
    ],
  },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ client, interaction }) => {
    const member = interaction.options.getMember('member')
    const action = sources[interaction.options.getString('action', true)]

    interaction.reply({ embeds: [{ color: client.colors.default, description: `${action.contents[0]} **\`| \`** ${(member ? action.contents[1] : action.contents[2]).replace(/{source}|{target}/g, str => ({ '{source}': interaction.member, '{target}': member }[str]))}`, image: { url: action.gifs.random() } }] })
  },
}
