const spinner = require('ora')()

module.exports = {
  start(msg) {
    console.log(' ')
    spinner.start(msg)
  },
  stop() {
    spinner.stop()
  },
  succeed(msg) {
    spinner.succeed(msg)
  },
  fail(msg) {
    spinner.fail(msg)
    console.log(' ')
  },
}
