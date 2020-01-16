const https = require('https')
const semver = require('semver')
const execa = require('execa')

const spinner = require('./spinner.js')
const exit = require('./exit.js')
const packageJson = require('../../package.json')

const fetchLatestVersion = () => {
  let url =
    'https://raw.githubusercontent.com/WebPlatformForEmbedded/Lightning-CLI/master/package.json'

  return new Promise((resolve, reject) => {
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
            reject(error)
          }
        })
      })
      .on('error', error => {
        reject(error)
      })
  })
}

const upToDate = (skip = false) => {
  if (skip === true) {
    return Promise.resolve()
  }

  spinner.start('Verifying if your installation of Lightning-CLI is up to date.')
  return fetchLatestVersion()
    .then(latestVersion => {
      const diff = semver.diff(latestVersion, packageJson.version)
      if (diff === 'major' || diff === 'minor') {
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
            exit()
          })
      } else {
        spinner.succeed()
        return Promise.resolve()
      }
    })
    .catch(error => {
      console.log('Unable to verify if Lightning-CLI is up to date')
      console.log(error)
    })
}

module.exports = upToDate
