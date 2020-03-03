const build = require('./build')
const watch = require('watch')
const exit = require('../helpers/exit')

const regexp = /^(?!src|static|settings\.json|metadata\.json)(.+)$/

let initCallbackProcess

module.exports = (initCallback, watchCallback) => {
  let busy = false
  return watch.watchTree(
    './',
    {
      interval: 1,
      filter(f) {
        return !!!regexp.test(f)
      },
      ignoreDirectoryPattern: /node_modules|\.git|dist|build/,
    },
    (f, curr, prev) => {
      // prevent initiating another build when already busy
      if (busy === true) {
        return
      }
      if (typeof f == 'object' && prev === null && curr === null) {
        build(true)
          .then(() => {
            initCallbackProcess = initCallback && initCallback()
          })
          .catch(() => {
            exit()
          })
      } else {
        busy = true

        // pass the 'type of change' based on the file that was changes
        let change
        if (/^src/g.test(f)) {
          change = 'src'
        }
        if (/^static/g.test(f)) {
          change = 'static'
        }
        if (f === 'metadata.json') {
          change = 'metadata'
        }
        if (f === 'settings.json') {
          change = 'settings'
        }

        build(false, change)
          .then(result => {
            busy = false
            watchCallback && watchCallback()
          })
          .catch(() => {
            busy = false
            // next line would stop the server, but we want to keep it running (may e should be configurable?)
            // initCallbackProcess && initCallbackProcess.cancel()
          })
      }
    }
  )
}
