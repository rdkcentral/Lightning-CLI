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

const execa = require('execa')
const chalk = require('chalk')
const path = require('path')
const buildHelpers = require('../helpers/build')
const isLocallyInstalled = require('../helpers/localinstallationcheck')
const sequence = require('../helpers/sequence')

module.exports = () => {
  return new Promise(resolve => {
    return sequence([
      () => buildHelpers.ensureLightningApp(),
      () => {
        console.log(chalk.green('Serving the Lightning-SDK documentation\n\n'))
        const docFolderPath = buildHelpers.hasNewSDK()
          ? 'node_modules/@lightningjs/sdk/docs'
          : 'node_modules/wpe-lightning-sdk/docs'
        const documentsPath = buildHelpers.findFile(process.cwd(), docFolderPath)
        const args = [documentsPath, '-o', '-c-1']

        const levelsDown = isLocallyInstalled()
          ? buildHelpers.findFile(process.cwd(), 'node_modules/.bin/http-server')
          : path.join(__dirname, '../..', 'node_modules/.bin/http-server')

        const subprocess = execa(levelsDown, args)
        subprocess.catch(e => console.log(chalk.red(e.stderr)))
        subprocess.stdout.pipe(process.stdout)

        subprocess.stdout.on('data', data => {
          if (/Open:/.test(data)) {
            const url = data
              .toString()
              .match(/https?:\/\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}(?=\s*$)/)[0]
            resolve({
              process: subprocess,
              config: {
                url: url,
                LNG_BUILD_FOLDER: args[0],
                LNG_SERVE_OPEN: args[1],
                LNG_SERVE_CACHE_TIME: args[2],
                LNG_SERVE_PORT: args[3],
                LNG_SERVE_PROXY: args[4],
              },
            })
          }
        })
      },
    ])
  })
}
