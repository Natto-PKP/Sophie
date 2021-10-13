const { Client } = require('discord.js')

/**
 * @param { { client: Client } } param0
 */
module.exports = ({ client }) => {
  client.application.fetch()

  console.log(`----------\n\n${client.user.username} est réveillée.`)
}
