const { Client, Message } = require('discord.js')
const { readdirSync } = require('fs')

const actions = {
  global: readdirSync('./events/messageCreate/actions/global').map(file => require(`./actions/global/${file}`)),
  guilds: readdirSync('./events/messageCreate/actions/guilds').map(file => require(`./actions/guilds/${file}`)),
}

const embeds = readdirSync('./events/messageCreate/embeds').map(file => require(`./embeds/${file}`))

/**
 * @param { { client: Client, databases: { users: import('mysql').Connection, items: import('mysql').Connection, guilds: import('mysql').Connection, counters: import('mysql').Connection }, params: [Message] } } param0
 */
module.exports = ({ client, databases, params: [message] }) => {
  if (message.author.bot) return

  if (message.guild) actions.guilds.forEach(execute => execute({ client, databases, message }))
  actions.global.forEach(execute => execute({ client, databases, message }))

  if (message.author.id == '570642674151981135') {
    const [prefix, command] = message.content.toLowerCase().split(/\s+/)
    if (prefix == 's!') embeds.find(({ body }) => body.name == command)?.execute({ client, databases, message })
  }
}
