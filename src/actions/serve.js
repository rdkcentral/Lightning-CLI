const execa = require('execa')
const path = require('path')
const fs = require('fs')
const sequence = require('../helpers/sequence')
const ask = require('../helpers/ask')

const askFolder = list => ask('Which folder do you want to serve?', null, 'list', list)

module.exports = () => {
  let folder
  return sequence([
    () => {
      return ['./build', './dist/es5', './dist/es6', './dist/lightning++'].filter(f =>
        fs.existsSync(path.join(process.cwd(), f))
      )
    },
    list => {
      if (list.length === 1) {
        folder = list[0]
      } else if (!list.length) {
        folder = './build'
      } else {
        return askFolder(list).then(val => (folder = val.toLowerCase()))
      }
    },
    () => {
      const subprocess = execa(path.join(__dirname, '../..', 'node_modules/.bin/http-server'), [
        folder,
        '-o',
        '-c-1',
      ])

      subprocess.stdout.pipe(process.stdout)

      return subprocess
    },
  ])
}
