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

const fs = require('fs')
const path = require('path')
const semver = require('semver')
const execa = require('execa')
const isOnline = require('is-online')
const latestVersion = require('latest-version')

const spinner = require('./spinner.js')
const exit = require('./exit.js')
const packageJson = require('../../package.json')
const ask = require('../helpers/ask')

const fetchLatestVersion = () => {
  return new Promise((resolve, reject) => {
    // if a git folder exists, we are probably working of a clone,
    // so likely we don't want to do any auto updates
    const gitFolder = path.join(__dirname, '../../.git')
    if (fs.existsSync(gitFolder)) {
      resolve(false)
    } else {
      return latestVersion(packageJson.name)
        .then(resolve)
        .catch(reject)
    }
  })
}

const upToDate = async (skip = false) => {
  if (process.env.LNG_AUTO_UPDATE !== undefined) {
    skip = process.env.LNG_AUTO_UPDATE === 'false' ? true : false
  }
  if (skip === true) {
    return true
  }
  spinner.start('Testing internet connection..')

  const isOnline = await testConnection()
  if (!isOnline) {
    spinner.fail()
    console.log('Unable to check for CLI update due to no internet connection')
    console.log(' ')

    const answer = await ask('Do you want to continue', null, 'list', ['Yes', 'No'])
    if (answer === 'Yes') {
      return true
    }

    exit()
  } else {
    spinner.succeed()
    return checkForUpdate()
  }
}

const testConnection = async () => {
  return await isOnline()
}
const checkForUpdate = () => {
  spinner.start('Verifying if your installation of Lightning-CLI is up to date.')
  return fetchLatestVersion()
    .then(version => {
      if (version === false) {
        spinner.succeed()
        return Promise.resolve()
      }
      if (
        semver.lt(packageJson.version, version) ||
        packageJson.name === 'wpe-lightning-cli' // always update when old package name
      ) {
        spinner.fail()
        spinner.start('Attempting to update Lightning-CLI to the latest version (' + version + ')')

        const options = ['install', '-g', '@lightningjs/cli']

        // force update when old package name
        if (packageJson.name === 'wpe-lightning-cli') {
          options.splice(2, 0, '-f')
        }

        return execa('npm', options)
          .then(() => {
            spinner.succeed()
            console.log(' ')
          })
          .catch(e => {
            spinner.fail('Error occurred while updating cli')
            console.log(e)
            console.log(' ')
            console.log(' ')
            console.log(
              'Please update Lightning-CLI manually by running: npm install -g -f @lightningjs/cli'
            )
            console.log(' ')
            exit()
          })
      } else {
        spinner.succeed()
        return Promise.resolve()
      }
    })
    .catch(error => {
      spinner.fail('Error occurred while checking for cli update')
      console.log(error)
      console.log(' ')
    })
}

module.exports = upToDate
