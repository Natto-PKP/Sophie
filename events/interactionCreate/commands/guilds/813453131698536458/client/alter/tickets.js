module.exports = {
  option: {
    name: 'tickets',
    description: "Gère le tickets d'un utilisateur",
    type: 'SUB_COMMAND',
    options: [
      { name: 'user', description: 'Utilisateur ciblé', type: 'USER', required: true },
      { name: 'amount', description: 'Nombre de points', type: 'NUMBER', required: true },
      { name: 'remove', description: 'Default: false', type: 'BOOLEAN' },
    ],
  },

  /**
   * @param { import("../../../../../../../structures/typing").Params<'command'> } param0
   */
  execute: ({ databases: { users }, interaction }) => {
    const values = { user: interaction.options.getUser('user', true), amount: interaction.options.getNumber('amount', true), remove: interaction.options.getBoolean('remove') }

    users.query(`SELECT tickets FROM economies WHERE id = "${values.user.id}";`).then(([result] = []) => {
      if (result) {
        if (values.remove) {
          result.tickets -= values.amount
          if (result.tickets < 0) result.tickets = 0
        } else result.tickets += values.amount

        users.query(`UPDATE economies SET tickets = ${result.tickets} WHERE id = "${values.user.id}";`)
        interaction.reply("**`⭕ | `** L'opération a été effectuée.")
      } else interaction.error({ content: "Cet utilisateur n'est pas dans la base de données." })
    })
  },
}
