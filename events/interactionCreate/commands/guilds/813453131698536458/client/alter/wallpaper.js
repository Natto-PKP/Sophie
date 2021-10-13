module.exports = {
  option: {
    name: 'wallpaper',
    description: "Gère le wallpaper d'un utilisateur",
    type: 'SUB_COMMAND',
    options: [
      { name: 'user', description: 'Utilisateur ciblé', type: 'USER', required: true },
      { name: 'wallpaper', description: 'ID du wallpaper', type: 'STRING', required: true },
      { name: 'remove', description: 'Default: false', type: 'BOOLEAN' },
    ],
  },

  /**
   * @param { import("../../../../../../../structures/typing").Params<'command'> } param0
   */
  execute: async ({ databases: { users, items }, interaction }) => {
    const values = { user: interaction.options.getUser('user', true), wallpaper: interaction.options.getString('wallpaper', true), remove: interaction.options.getBoolean('remove') }
    const [wallpaper] = await items.query(`SELECT id FROM wallpapers WHERE id = "${values.wallpaper}";`)

    if (wallpaper) {
      users.query(`SELECT wallpaper FROM wallpapers WHERE id = "${values.user.id}" AND wallpaper = "${values.wallpaper}";`).then(([result] = []) => {
        if (values.remove) result ? users.query(`DELETE FROM TABLE wallpapers WHERE id = "${values.user.id}" AND wallpaper = "${values.wallpaper}";`) : interaction.error({ content: 'Cet utilisateur ne possède pas ce wallpaper.' })
        else result ? interaction.error({ content: 'Cet utilisateur possède déjà ce wallpaper.' }) : users.query(`INSERT INTO wallpapers (id, wallpaper) VALUES ("${values.user.id}", "${values.wallpaper}");`)
        interaction.reply("**`⭕ | `** L'opération a été effectuée.")
      })
    } else interaction.error({ content: "L'id indiqué est invalide." })
  },
}
