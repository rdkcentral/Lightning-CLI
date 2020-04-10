const execa = require('execa')
const path = require('path')

module.exports = () => {
  const subprocess = execa(path.join(__dirname, '../..', 'node_modules/.bin/http-server'), [
    './dist',
    '-o',
    '-c-1',
  ])

  subprocess.stdout.pipe(process.stdout)

  return subprocess
}
