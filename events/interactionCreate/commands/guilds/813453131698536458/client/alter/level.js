module.exports = {
  option: {
    name: 'level',
    description: "Gère le niveau d'un utilisateur",
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

    users.query(`SELECT level, points FROM experiences WHERE id = "${values.user.id}";`).then(([result] = []) => {
      if (result) {
        if (values.remove) {
          result.level -= values.amount
          result.points = 0
          if (result.level < 0) result.level = 0
        } else result.level += values.amount

        users.query(`UPDATE experiences SET level = ${result.level}, points = ${result.points} WHERE id = "${values.user.id}";`)
        interaction.reply("**`⭕ | `** L'opération a été effectuée.")
      } else interaction.error({ content: "Cet utilisateur n'est pas dans la base de données." })
    })
  },
}
