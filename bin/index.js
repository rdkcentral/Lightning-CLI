#!/usr/bin/env node

/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// load and parse (optional) .env file with
require('dotenv').config()

const program = require('commander')
const didYouMean = require('didyoumean2').default
const chalk = require('chalk')

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
  .version('Lightning-CLI ' + require('../package').version)
  .usage('lightning-cli <command> [options]')

program
  .command('create')
  .description(['✨', ' '.repeat(3), 'Create a new Lightning App'].join(''))
  .action(() => {
    updateCheck(true)
      .then(() => createAction())
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })

program
  .command('build')
  .option('--es5', 'Build standalone ES5 version of the App')
  .option('--es6', 'Build standalone ES6 version of the App')
  .description(
    ['👷‍♂️', ' '.repeat(3), 'Build a local development version of the Lightning App'].join('')
  )
  .action(options => {
    const input = options.opts()
    const defaultTypes = ['default']

    const selectedTypes = Object.keys(input)
      .map(type => input[type] === true && type.toLocaleLowerCase())
      .filter(val => !!val)

    updateCheck()
      .then(() => buildAction(true, null, selectedTypes.length ? selectedTypes : defaultTypes))
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
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
    updateCheck()
      .then(() => serveAction())
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })

program
  .command('watch')
  .description(
    ['👀', ' '.repeat(3), 'Watch for file changes and automatically rebuild the App'].join('')
  )
  .action(() => {
    updateCheck()
      .then(() => watchAction())
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })

program
  .command('dev')
  .description(
    [
      '👨‍💻',
      ' '.repeat(3),
      'Build a local Lightning App, start a local webserver, run a built Lightning App in a web browser and watch for changes',
    ].join('')
  )
  .action(() => {
    updateCheck()
      .then(() => devAction())
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })

program
  .command('docs')
  .description(['📖', ' '.repeat(3), 'Open the Lightning-SDK documentation'].join(''))
  .action(() => {
    updateCheck()
      .then(() => docsAction())
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })

program
  .command('dist')
  .option('--es5', 'Build standalone ES5 version of the App')
  .option('--es6', 'Build standalone ES6 version of the App')
  .option(
    '--watch',
    'Watch for file changes and automatically update the distributable version of the App'
  )
  .description(
    ['🌎', ' '.repeat(3), 'Create a standalone distributable version of the Lightning App'].join('')
  )
  .action(options => {
    const input = options.opts()

    const defaultTypes = ['es6']
    const isWatchEnabled = input.watch ? input.watch : false
    delete input.watch

    const selectedTypes = Object.keys(input)
      .map(type => input[type] === true && type.toLocaleLowerCase())
      .filter(val => !!val)

    updateCheck()
      .then(() =>
        distAction({
          types: selectedTypes.length ? selectedTypes : defaultTypes,
          isWatchEnabled,
        })
      )
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })

program
  .command('upload')
  .description(
    [
      '🚀',
      ' '.repeat(3),
      'Upload the Lightning App to the Metrological Back Office to be published in an App Store',
    ].join('')
  )
  .action(() => {
    updateCheck(true)
      .then(() => uploadAction())
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })

program
  .command('update')
  .description(['🔄', ' '.repeat(3), 'Update the Lightning-CLI to the latest version'].join(''))
  .action(() => {
    updateCheck(true)
      .then(() => process.exit(1))
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })

program.on('command:*', () => {
  const suggestion = didYouMean(
    program.args[0] || '',
    program.commands.map(command => command._name)
  )

  console.log("Sorry, that command doesn't seems to exist ...")
  console.log('')
  if (suggestion) {
    console.log('Perhaps you meant: ' + chalk.yellow('lng ' + suggestion) + '?')
    console.log('')
  }
  console.log('Use ' + chalk.yellow('lng -h') + ' to see a full list of available commands')
  process.exit(1)
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
