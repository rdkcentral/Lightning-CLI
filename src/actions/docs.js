const execa = require('execa')
const path = require('path')

module.exports = () => {
  execa(path.join(__dirname, '../..', 'node_modules/.bin/http-server'), [
    path.join(process.cwd(), 'node_modules/wpe-lightning-sdk/docs'),
    '-o',
    '-c-1',
  ])
}
