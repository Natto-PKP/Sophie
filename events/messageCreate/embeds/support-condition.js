module.exports = {
  body: { name: 'support-condition' },

  /**
   * @param { import("../../../structures/typing").Params<'message'> } param0
   */
  execute: ({ message, client }) => {
    message.channel.send({
      embeds: [
        {
          color: client.colors.default,
          author: { name: '⚠ Sophie • Conditions' },
          description: [
            `**•** ${client.user} n'est pas un bot open-source. Il est donc inutile et sanctionnable de demander à avoir ses lignes de codes`,
            '**•** Signalez votre présence et la raison de votre venu sur le serveur dès que vous le pouvez, nous vous aiderons au mieux',
            `**•** Si vous rencontrer le moindre soucis ou incompréhension lors de l'utilisation de ${client.user}, signalez le directement dans le salon support`,
          ].join('\n\n'),
          image: { url: 'https://i.imgur.com/Zw1FRjU.png' },
        },
      ],

      components: [{ type: 'ACTION_ROW', components: [require('../../interactionCreate/buttons/support-rules-check').body] }],
    })
  },
}
