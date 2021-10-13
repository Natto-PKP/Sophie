const { readdirSync } = require('fs')

const sub_commands = readdirSync('./events/interactionCreate/commands/global/shop').map(file => require(`./shop/${file}`))

// Interactions
const global_interactions = {
  buttons: {
    previous: { type: 'BUTTON', customId: 'shop-previous', style: 'SECONDARY', emoji: '⬅' },
    next: { type: 'BUTTON', customId: 'shop-next', style: 'SECONDARY', emoji: '➡' },
    close: { type: 'BUTTON', customId: 'shop-close', style: 'DANGER', label: 'Quitter' },
    buy: { type: 'BUTTON', customId: 'shop-buy', style: 'SUCCESS', label: 'Acheter', emoji: '💴' },
  },
  select_menu: {
    type: 'SELECT_MENU',
    customId: 'shop-order',
    placeholder: 'Triez cette liste selon un ordre',
    options: [
      { label: 'Triez du moins cher au plus cher', emoji: '↗', value: 'up' },
      { label: 'Triez du plus cher au moins cher', emoji: '↘', value: 'down' },
    ],
  },
}

module.exports = {
  body: { name: 'shop', description: 'Faîtes le tour de nos magasins', options: sub_commands.map(sub_command => sub_command.option) },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ client, databases, interaction }) => sub_commands.find(({ option }) => option.name == interaction.options.getSubcommand())?.execute({ client, databases, interaction, options: interaction.options.data[0].options, global_interactions }),
}
