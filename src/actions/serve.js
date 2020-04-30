const execa = require('execa')
const path = require('path')
const chalk = require('chalk')

module.exports = () => {
  console.log(process.env.LNG_SERVE_OPEN)
  const args = [
    './dist',
    process.env.LNG_SERVE_OPEN === 'false' ? false : '-o',
    process.env.LNG_SERVE_CACHE_TIME ? '-c' + process.env.LNG_SERVE_CACHE_TIME : '-c-1',
    process.env.LNG_SERVE_PORT ? '-p' + process.env.LNG_SERVE_PORT : false,
  ].filter(val => val)

  const subprocess = execa(path.join(__dirname, '../..', 'node_modules/.bin/http-server'), args)

  subprocess.catch(e => console.log(chalk.red(e.stderr)))
  subprocess.stdout.pipe(process.stdout)

  return subprocess
}
