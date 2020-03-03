#!/usr/bin/env node
const program = require('commander')
const createAction = require('../src/actions/create')
const buildAction = require('../src/actions/build')
const distAction = require('../src/actions/dist')
const uploadAction = require('../src/actions/upload')
const serveAction = require('../src/actions/serve')
const watchAction = require('../src/actions/watch')
const devAction = require('../src/actions/dev')
const docsAction = require('../src/actions/docs')
const upToDate = require('../src/helpers/uptodate')

const updateCheck = (force = null) => upToDate(force === null ? Math.random() < 0.8 : !force)

program
  .version(`Lightning-CLI ${require('../package').version}`)
  .usage('lightning-cli <command> [options]')

program
  .command('create')
  .description(['✨', ' '.repeat(3), 'Create a new Lightning App'].join(''))
  .action(() => {
    updateCheck(true).then(() => createAction())
  })

program
  .command('build')
  .description(
    ['👷‍♂️', ' '.repeat(3), 'Build a local development version of the Lightning App'].join('')
  )
  .action(() => {
    updateCheck().then(() => buildAction(true))
  })

program
  .command('serve')
  .description(
    [
      '🖥',
      ' '.repeat(4),
      'Start a local webserver and run a built Lightning App in a web browser',
    ].join('')
  )
  .action(() => {
    updateCheck().then(() => serveAction())
  })

program
  .command('watch')
  .description(
    ['👀', ' '.repeat(3), 'Watch for file changes and automatically rebuild the App'].join('')
  )
  .action(() => {
    updateCheck().then(() => watchAction())
  })

program
  .command('dev')
  .description(
    [
      '👨‍💻',
      ' '.repeat(3),
      'Build a local Lightning App, start a local webserver and watch for changes',
    ].join('')
  )
  .action(() => {
    updateCheck().then(() => devAction())
  })

program
  .command('docs')
  .description(['📖', ' '.repeat(3), 'Open the Lightning-SDK documentation'].join(''))
  .action(() => {
    updateCheck().then(() => docsAction())
  })

program
  .command('dist')
  .description(
    ['🌎', ' '.repeat(3), 'Create a standalone, distributable version of the Lightning App'].join(
      ''
    )
  )
  .action(() => {
    updateCheck().then(() => distAction())
  })

program
  .command('upload')
  .description(
    [
      '🚀',
      ' '.repeat(3),
      'Upload the Lightning App to the Metrological Back Office to be published in the App Store',
    ].join('')
  )
  .action(() => {
    updateCheck(true).then(() => uploadAction())
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
