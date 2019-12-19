const execa = require('execa')

module.exports = () => {
  execa('./node_modules/.bin/http-server', ['./dist', '-o', '-c-1']).stdout.pipe(process.stdout)
}
