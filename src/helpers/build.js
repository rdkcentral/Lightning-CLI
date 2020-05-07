/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
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

const shell = require('shelljs')
const fs = require('fs')
const execa = require('execa')
const path = require('path')

const spinner = require('../helpers/spinner')

const removeFolder = folder => {
  spinner.start('Removing "' + folder.split('/').pop() + '" folder')
  shell.rm('-rf', folder)
  spinner.succeed()
}

const ensureFolderExists = folder => {
  spinner.start('Ensuring "' + folder.split('/').pop() + '" folder exists')
  shell.mkdir('-p', folder)
  spinner.succeed()
}

const copySupportFiles = folder => {
  spinner.start('Copying support files to "' + folder.split('/').pop() + '"')

  // see if project is "old" style (i.e. has no lib folder in support)
  // TODO: this whole block could be removed at one point assuming all projects are updated
  if (!fs.existsSync('./node_modules/wpe-lightning-sdk/support/lib')) {
    console.log('')
    console.log('')
    // fixme: add example npm command to upgrade to latest SDK
    console.log(
      '⚠️  You are using an older version of the Lightning SDK. Please consider upgrading to the latest version.  ⚠️'
    )
    console.log('')
    shell.cp('./node_modules/wpe-lightning/dist/lightning.js', folder)
    // lightning es5 bundle in dist didn't exist in earlier versions (< 1.3.1)
    if (fs.existsSync('./node_modules/wpe-lightning/dist/lightning.es5.js')) {
      shell.cp('./node_modules/wpe-lightning/dist/lightning.es5.js', folder)
    }
    shell.cp('./node_modules/wpe-lightning/devtools/lightning-inspect.js', folder)
    // lightning es5 inspector in devtools didn't exist in earlier versions (< 1.3.1)
    if (fs.existsSync('./node_modules/wpe-lightning/devtools/lightning-inspect.es5.js')) {
      shell.cp('./node_modules/wpe-lightning/devtools/lightning-inspect.es5.js', folder)
    }
  }
  // simply copy everything in the support folder
  shell.cp('-r', './node_modules/wpe-lightning-sdk/support/*', folder)
  spinner.succeed()
}

const copyStaticFolder = folder => {
  spinner.start('Copying static assets to "' + folder.split('/').pop() + '"')
  shell.cp('-r', './static', folder)
  spinner.succeed()
}

const copySrcFolder = folder => {
  shell.cp('-r', './src', folder)
}

const copySettings = folder => {
  const file = './settings.json'
  if (fs.existsSync(file)) {
    spinner.start('Copying settings.json "' + folder.split('/').pop() + '"')
    shell.cp(file, folder)
    spinner.succeed()
  }
}

const copyMetadata = folder => {
  const file = './metadata.json'
  if (fs.existsSync(file)) {
    spinner.start('Copying metadata.json "' + folder.split('/').pop() + '"')
    shell.cp(file, folder)
    spinner.succeed()
  }
}

const readMetadata = () => {
  return new Promise(resolve => {
    const metadata = fs.readFileSync('./metadata.json', 'utf8')
    resolve(JSON.parse(metadata))
  })
}

const readSettings = () => {
  return new Promise(resolve => {
    const settings = fs.readFileSync('./settings.json', 'utf8')
    resolve(JSON.parse(settings))
  })
}

const bundleEs6App = (folder, metadata) => {
  spinner.start('Building ES6 appBundle and saving to "' + folder.split('/').pop() + '"')

  return execa(path.join(__dirname, '../..', 'node_modules/.bin/rollup'), [
    '-c',
    path.join(__dirname, '../configs/rollup.es6.config.js'),
    '--input',
    path.join(process.cwd(), 'src/index.js'),
    '--file',
    path.join(folder, 'appBundle.js'),
    '--name',
    'APP_' + metadata.identifier.replace(/\./g, '_').replace(/-/g, '_'),
  ])
    .then(() => {
      spinner.succeed()
      return metadata
    })
    .catch(e => {
      spinner.fail('Error while creating ES6 bundle (see log)')
      console.log(e.stderr)
      throw Error(e)
    })
}

const bundleEs5App = (folder, metadata) => {
  spinner.start('Building ES5 appBundle and saving to "' + folder.split('/').pop() + '"')

  return execa(path.join(__dirname, '../..', 'node_modules/.bin/rollup'), [
    '-c',
    path.join(__dirname, '../configs/rollup.es5.config.js'),
    '--input',
    path.join(process.cwd(), 'src/index.js'),
    '--file',
    path.join(folder, 'appBundle.es5.js'),
    '--name',
    'APP_' + metadata.identifier.replace(/\./g, '_').replace(/-/g, '_'),
  ])
    .then(() => {
      spinner.succeed()
      return metadata
    })
    .catch(e => {
      spinner.fail('Error while creating ES5 bundle (see log)')
      console.log(e.stderr)
      throw Error(e)
    })
}

module.exports = {
  removeFolder,
  ensureFolderExists,
  copySupportFiles,
  copyStaticFolder,
  copySrcFolder,
  copySettings,
  copyMetadata,
  readMetadata,
  readSettings,
  bundleEs6App,
  bundleEs5App,
}
