const execa = require('execa')
const path = require('path')

module.exports = () => {
  execa(path.join(__dirname, '../..', 'node_modules/.bin/http-server'), [
    './dist',
    '-o',
    '-c-1',
  ]).stdout.pipe(process.stdout)
}
