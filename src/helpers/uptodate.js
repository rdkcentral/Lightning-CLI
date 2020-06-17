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

const fs = require('fs')
const path = require('path')
const https = require('https')
const semver = require('semver')
const execa = require('execa')
const isOnline = require('is-online')

const spinner = require('./spinner.js')
const exit = require('./exit.js')
const packageJson = require('../../package.json')
const ask = require('../helpers/ask')

const fetchLatestVersion = () => {
  const gitBranch = getGitBranch()
  const url = gitBranch
    ? 'https://raw.githubusercontent.com/WebPlatformForEmbedded/Lightning-CLI/' +
      gitBranch +
      '/package.json'
    : false

  return new Promise((resolve, reject) => {
    if (!url) reject('Skipping auto update.')
    https
      .get(url, res => {
        let body = ''

        res.on('data', chunk => {
          body += chunk
        })

        res.on('end', () => {
          try {
            let json = JSON.parse(body)
            resolve(json.version)
          } catch (error) {
            reject('Unable to get CLI version from ' + url)
          }
        })
      })
      .on('error', error => {
        reject(error)
      })
  })
}

const upToDate = async (skip = false) => {
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
    .then(latestVersion => {
      if (semver.lt(packageJson.version, latestVersion)) {
        spinner.fail()
        spinner.start(
          'Attempting to update Lightning-CLI to the latest version (' + latestVersion + ')'
        )
        return execa('npm', ['install', '-g', 'WebPlatformForEmbedded/Lightning-CLI'])
          .then(() => {
            spinner.succeed()
            console.log(' ')
          })
          .catch(e => {
            spinner.fail()
            console.log(e)
            console.log(' ')
            console.log(' ')
            console.log(
              'Please update Lightning-CLI manually by running: npm install -g WebPlatformForEmbedded/Lightning-CLI'
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
      spinner.fail()
      console.log(error)
      console.log(' ')
    })
}

const getGitBranch = () => {
  // if a git folder exists, we are probably working of a clone,
  // so likely we don't want to do any auto updates
  const gitFolder = path.join(__dirname, '../../.git')
  if (fs.existsSync(gitFolder)) {
    return false
  }
  // otherwise base on the package.json
  else {
    const packageJson = require(path.join(__dirname, '../../package.json'))
    if (packageJson._requested && 'gitCommittish' in packageJson._requested) {
      return packageJson._requested.gitCommittish || 'master' // gitCommittish is null for master
    } else {
      return false
    }
  }
}

module.exports = upToDate
