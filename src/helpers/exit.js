const spinner = require('./spinner')

const exit = msg => {
  spinner.fail(msg)
  process.exit()
}

module.exports = exit
