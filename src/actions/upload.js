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

const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const chalk = require('chalk')

const packageAction = require('./package')
const sequence = require('../helpers/sequence')
const ask = require('../helpers/ask')
const spinner = require('../helpers/spinner')
const exit = require('../helpers/exit')
const buildHelpers = require('../helpers/build')

const UPLOAD_ERRORS = {
  version_already_exists: 'The current version of your app already exists',
  missing_field_file: 'There is a missing field',
  app_belongs_to_other_user: 'You are not the owner of this app',
}

const login = key => {
  spinner.start('Authenticating with Metrological Back Office')
  return axios
    .get('https://api.metrological.com/api/authentication/login-status', {
      headers: { 'X-Api-Token': key },
    })
    .then(({ data }) => {
      const user = data.securityContext.pop()
      if (user) {
        spinner.succeed()
        return user
      }
      exit('Unexpected authentication error')
    })
    .catch(err => {
      exit('Incorrect API key or not logged in to metrological dashboard')
    })
}

const upload = (packageData, user) => {
  spinner.start('Uploading package to Metrological Back Office')

  if (!packageData.identifier) {
    exit("Metadata.json doesn't contain an identifier field")
  }
  if (!packageData.version) {
    exit("Metadata.json doesn't contain an version field")
  }

  const form = new FormData()
  form.append('id', packageData.identifier)
  form.append('version', packageData.version)
  form.append('upload', fs.createReadStream(packageData.tgzFile))

  const headers = form.getHeaders()
  headers['X-Api-Token'] = user.apiKey

  axios
    .post('https://api.metrological.com/api/' + user.type + '/app-store/upload-lightning', form, {
      headers,
    })
    .then(({ data }) => {
      // errors also return a 200 status reponse, so we intercept errors here manually
      if (data.error) {
        exit(UPLOAD_ERRORS[data.error] || data.error)
      } else {
        spinner.succeed()
        console.log()
        console.log(chalk.yellow('WARNING!!'))
        console.log()
        console.log(
          chalk.yellow(
            'The `lng upload` command has been deprecated and has moved to a separate package.'
          )
        )
        console.log(
          chalk.yellow(
            'Please see https://www.github.com/Metrological/metrological-cli for more info.'
          )
        )
        console.log(
          chalk.yellow(
            'The upload command will be completely removed from the Lightning-CLI in the Jan 2023 release.'
          )
        )
      }
    })
    .catch(err => {
      exit(UPLOAD_ERRORS[err] || err)
    })
}

const checkUploadFileSize = packageData => {
  const stats = fs.statSync(packageData.tgzFile)
  const fileSizeInMB = stats.size / 1000000 //convert from Bytes to MB

  if (fileSizeInMB >= 10) {
    exit('Upload File size is greater than 10 MB. Please make sure the size is less than 10MB')
  }
  return packageData
}

module.exports = () => {
  let user
  return sequence([
    () => buildHelpers.ensureLightningApp(),
    () => buildHelpers.ensureCorrectGitIgnore(),
    // todo: save API key locally for future use and set it as default answer
    () => ask('Please provide your API key'),
    apiKey => login(apiKey).then(usr => ((user = usr), (usr.apiKey = apiKey))),
    () => packageAction(),
    packageData => checkUploadFileSize(packageData),
    packageData => upload(packageData, user),
  ])
}
