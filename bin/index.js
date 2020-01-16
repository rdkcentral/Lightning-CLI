#!/usr/bin/env node
const program = require('commander')
const createAction = require('../src/actions/create')
const buildAction = require('../src/actions/build')
const releaseAction = require('../src/actions/release')
const uploadAction = require('../src/actions/upload')
const serveAction = require('../src/actions/serve')
const watchAction = require('../src/actions/watch')
const devAction = require('../src/actions/dev')
const docsAction = require('../src/actions/docs')
const upToDate = require('../src/helpers/uptodate')

program
  .version(`Lightning-CLI ${require('../package').version}`)
  .usage('lightning-cli <command> [options]')

program
  .command('create')
  .description(['✨', ' '.repeat(3), 'Create a new Lightning App'].join(''))
  .action(() => {
    upToDate().then(createAction)
  })

program
  .command('build')
  .description(
    ['👷‍♂️', ' '.repeat(3), 'Build a standalone Lightning App (to run in a web browser)'].join('')
  )
  .action(() => {
    buildAction(true)
  })

program
  .command('serve')
  .description(
    ['🖥', ' '.repeat(4), 'Start a local webserver and run a Lightning App in a web browser'].join(
      ''
    )
  )
  .action(() => {
    serveAction()
  })

program
  .command('watch')
  .description(
    ['👀', ' '.repeat(3), 'Watch the for file changes and automatically rebuild the app'].join('')
  )
  .action(() => {
    watchAction()
  })

program
  .command('dev')
  .description(
    [
      '👨‍💻',
      ' '.repeat(3),
      'Build a standalone Lightning App, start a local webserver and watch for changes',
    ].join('')
  )
  .action(() => {
    devAction()
  })

program
  .command('docs')
  .description(['📖', ' '.repeat(3), 'Open the documentation'].join(''))
  .action(() => {
    docsAction()
  })

program
  .command('release')
  .description(['📦', ' '.repeat(3), 'Build a release package of a Lightning App'].join(''))
  .action(() => {
    upToDate().then(releaseAction)
  })

program
  .command('upload')
  .description(['🚀', ' '.repeat(3), 'Upload release package to Metrological Back Office'].join(''))
  .action(() => {
    upToDate().then(uploadAction)
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
