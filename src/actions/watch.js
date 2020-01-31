const build = require('./build')
const watch = require('watch')
const exit = require('../helpers/exit')

const regexp = /^(?!src|static|settings\.json|metadata\.json)(.+)$/

let initCallbackProcess

module.exports = (initCallback, watchCallback) => {
  return watch.watchTree(
    './',
    {
      interval: 1,
      filter(f) {
        return !!!regexp.test(f)
      },
      ignoreDirectoryPattern: /node_modules|\.git|dist/,
    },
    (f, curr, prev) => {
      if (typeof f == 'object' && prev === null && curr === null) {
        build(true)
          .then(() => {
            initCallbackProcess = initCallback && initCallback()
          })
          .catch(() => {
            exit()
          })
      } else {
        // pass the 'type of change' based on the file that was changes
        let change
        if (/^src/g.test(f)) {
          change = 'src'
        }
        if (/^static/g.test()) {
          change = 'static'
        }
        if (f === 'metadata.json') {
          change = 'metadata'
        }
        if (f === 'settings.json') {
          change = 'settings'
        }

        build(false, change)
          .then(watchCallback && watchCallback)
          .catch(() => {
            initCallbackProcess.cancel()
            exit()
          })
      }
    }
  )
}
