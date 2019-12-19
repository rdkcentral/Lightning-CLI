const build = require('./build')
const watch = require('watch')

const regexp = /^(?!src|static|settings\.json|metadata\.json)(.+)$/

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
        build(true).then(initCallback && initCallback)
      } else {
        build().then(watchCallback && watchCallback) // fixme: pass an object with what to build exactly ...
      }
    }
  )
}
