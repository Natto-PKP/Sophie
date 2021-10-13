module.exports = {
  option: {
    name: 'gold',
    description: "Gère le golds d'un utilisateur",
    type: 'SUB_COMMAND',
    options: [
      { name: 'user', description: 'Utilisateur ciblé', type: 'USER', required: true },
      { name: 'amount', description: 'Nombre de points', type: 'NUMBER', required: true },
      { name: 'remove', description: 'Default: false', type: 'BOOLEAN' },
    ],
  },

  /**
   * @param { import('../../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ databases: { users }, interaction }) => {
    const values = { user: interaction.options.getUser('user', true), amount: interaction.options.getNumber('amount', true), remove: interaction.options.getBoolean('remove') }

    users.query(`SELECT golds FROM economies WHERE id = "${values.user.id}";`).then(([result] = []) => {
      if (result) {
        if (values.remove) {
          result.golds -= values.amount
          if (result.golds < 0) result.golds = 0
        } else result.golds += values.amount

        users.query(`UPDATE economies SET golds = ${result.golds} WHERE id = "${values.user.id}";`)
        interaction.reply("**`⭕ | `** L'opération a été effectuée.")
      } else interaction.error({ content: "Cet utilisateur n'est pas dans la base de données." })
    })
  },
}
