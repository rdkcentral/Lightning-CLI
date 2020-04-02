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
    if (!url) reject('Unknown Git branch')
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
  const gitHead = path.join(__dirname, '../../.git/HEAD')
  if (fs.existsSync(gitHead)) {
    const match = /ref: refs\/heads\/([^\n]+)/.exec(fs.readFileSync(gitHead).toString())
    return match ? match[1] : false
  } else {
    return false
  }
}

module.exports = upToDate
