const { modules } = require('../../../../../../../config')

module.exports = {
  option: {
    name: 'exp',
    description: "Gère l'expérience d'un utilisateur",
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

    users.query(`SELECT points, level FROM experiences WHERE id = "${values.user.id}";`).then(([result] = []) => {
      if (result) {
        if (values.remove) {
          if (result.points - values.amount < 0) {
            values.amount -= result.points
            result.points = 0

            while (1) {
              if (values.amount > result.points) {
                values.amount -= result.points
                result.points = modules.exp.toUp(result.level < 1 ? 1 : result.level - 1)
                if (result.level < 1) break
                --result.level
              } else {
                result.points -= values.amount
                break
              }
            }
          } else result.points -= values.amount
        } else {
          result.points += values.amount
          while (1) {
            const req = modules.exp.toUp(result.level)
            if (result.points >= req) {
              result.points -= req
              ++result.level
            } else break
          }
        }

        users.query(`UPDATE experiences SET points = ${result.points}, level = ${result.level} WHERE id = "${values.user.id}";`)
        interaction.reply("**`⭕ | `** L'opération a été effectuée.")
      } else interaction.error({ content: "Cet utilisateur n'est pas dans la base de données." })
    })
  },
}
