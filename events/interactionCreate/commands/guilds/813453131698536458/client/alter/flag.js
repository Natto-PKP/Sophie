const flags = require('../../../../../../../structures/flags').users

module.exports = {
  option: {
    name: 'flag',
    description: "Gère les flags d'un utilisateur",
    type: 'SUB_COMMAND',
    options: [
      { name: 'type', description: "Ajouter un flag à l'utilisateur", type: 'STRING', required: true },
      { name: 'user', description: 'Utilisateur ciblé', type: 'USER', required: true },
      { name: 'remove', description: 'Default: false', type: 'BOOLEAN' },
    ],
  },

  /**
   * @param { import('../../../../../../../structures/typing').Params<'command'> } param0
   */
  execute: ({ databases: { users }, interaction }) => {
    const values = { user: interaction.options.getUser('user', true), remove: interaction.options.getBoolean('remove'), type: interaction.options.getString('type') }
    if (!flags[values.type]) return interaction.error({ content: "Ce flag n'existe pas" })

    users.query(`SELECT flags FROM profiles WHERE id = "${values.user.id}";`).then(([result = { flags: 0 }] = []) => {
      const own_flags = BigInt(result.flags).resolve('users')

      if (own_flags.includes(values.type)) {
        if (!values.remove) return interaction.error({ content: `Le flag \`${values.type}\` est déjà inclus aux tags de l'utilisateur` })
        own_flags.splice(own_flags.indexOf(values.type), 1)
        users.query(`UPDATE profiles SET flags = ${Number(own_flags.reduce((acc, flag) => acc | flags[flag], 0n))} WHERE id = "${values.user.id}";`)
        interaction.reply("**`⭕ | `** L'opération a été effectuée.")
      } else {
        if (values.remove) return interaction.error({ content: `Le flag \`${values.type}\` n'est pas inclus aux tags de l'utilisateur` })
        own_flags.push(values.type)
        const value = Number(own_flags.reduce((acc, flag) => acc | flags[flag], 0n))
        users.query(`INSERT INTO profiles (id, flags) VALUES ("${values.user.id}", ${value}) ON DUPLICATE KEY UPDATE flags = ${value};`)
        interaction.reply("**`⭕ | `** L'opération a été effectuée.")
      }
    })
  },
}
