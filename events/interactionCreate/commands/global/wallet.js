module.exports = {
  body: { name: 'wallet', description: 'Inpectez votre porte-monnaie' },

  /**
   * @param { import('../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ databases: { users }, interaction }) => users.query(`SELECT golds, tickets FROM economies WHERE id = "${interaction.user.id}";`).then(([result = { golds: 0, tickets: 0 }] = []) => interaction.reply({ content: `\`👛 | Votre porte monnaie \` **${result.golds.form()}** 💴 • **${result.tickets.form()}** 🧧`, ephemeral: true })),
}
