const experiences = require('../../../../structures/experiences')

const cooldowns = {}

/**
 * @param { import('../../../../structures/typing').Params<'message'> } param0
 */
module.exports = ({ databases: { users }, message }) => {
  const id = message.author.id
  if (cooldowns[id] && cooldowns[id] - Date.now() > 0) return

  users.query(`SELECT level, points, tickets FROM experiences LEFT JOIN economies ON experiences.id = economies.id WHERE experiences.id = "${id}";`).then(([result = {}] = []) => {
    Object.resolve(result, { points: 0, level: 0, tickets: 0 })
    const random = Math.ceil((Math.random() * 4 + 2) * ([0, 6].includes(new Date().getDay()) ? 2 : 1))
    const next = experiences.need(result.level)

    if (result.points + random >= next) {
      if ((result.level + 1) % 2 == 0) users.query(`INSERT INTO economies (id, tickets) VALUES ("${id}", ${result.tickets + 1}) ON DUPLICATE KEY UPDATE tickets = tickets + 1;`)
      users.query(`UPDATE experiences SET points = ${result.points + random - next}, level = ${result.level + 1} WHERE id = "${id}";`)
    } else users.query(`INSERT INTO experiences (id, points) VALUES ("${id}", ${result.points + random}) ON DUPLICATE KEY UPDATE points = points + ${random};`)

    cooldowns[id] = Date.now() + 2500
  })
}

setTimeout(() => {
  for (const id in cooldowns) if (cooldowns[id] - Date.now() < 0) delete cooldowns[id]
}, 72e5)
