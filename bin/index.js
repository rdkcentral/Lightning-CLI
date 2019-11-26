#!/usr/bin/env node
const program = require('commander')
const createAction = require('../src/actions/create')
const buildAction = require('../src/actions/build')
const releaseAction = require('../src/actions/release')
const uploadAction = require('../src/actions/upload')

program
  .version(`Lightning-CLI ${require('../package').version}`)
  .usage('lightning <command> [options]')

program
  .command('create')
  .description(['✨', ' '.repeat(3), 'Create a new Lightning App'].join(''))
  .action(() => {
    createAction()
  })

program
  .command('build')
  .description(
    ['👷‍♂️', ' '.repeat(2), 'Build a standalone Lightning App (to run in a webbrowser)'].join('')
  )
  .action(() => {
    buildAction()
  })

program
  .command('release')
  .description(['📦', ' '.repeat(3), 'Build a release package of a Lightning App'].join(''))
  .action(() => {
    releaseAction()
  })

program
  .command('upload')
  .description(['🚀', ' '.repeat(3), 'Upload release package to Metrological Back Office'].join(''))
  .action(() => {
    uploadAction()
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
