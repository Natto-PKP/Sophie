// Depencies
const { Client } = require('discord.js')
const { readdirSync, existsSync } = require('fs')
const { token } = require('./config')

// Load
readdirSync('./methods').forEach(file => require(`./methods/${file}`))
readdirSync('./structures').forEach(file => file.endsWith('.js') && require(`./structures/${file}`))

// Constantes
const client = new Client({ intents: 14319, partials: ['CHANNEL'] })
const databases = require('./structures/databases')(client)

// Events handler
readdirSync('./events').forEach(event => {
  client.on(event, (...params) => {
    const base = { client, databases, params }
    existsSync('./events/' + event + '/index.js') ? require('./events/' + event + '/index.js')(base) : readdirSync('./events/' + event + '/').forEach(file => require('./events/' + event + '/' + file)(base))
  })
})

// Connect
client.login(token.canary)
