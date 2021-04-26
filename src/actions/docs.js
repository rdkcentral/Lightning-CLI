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
  return sequence([
    () => buildHelpers.ensureLightningApp(),
    () => {
      console.log(chalk.green('Serving the Lightning-SDK documentation\n\n'))

      const args = [
        path.join(
          process.cwd(),
          buildHelpers.hasNewSDK()
            ? 'node_modules/@lightningjs/sdk/docs'
            : 'node_modules/wpe-lightning-sdk/docs'
        ),
        '-o',
        '-c-1',
      ]
      const levelsDown = isLocallyInstalled() ? '../../../../..' : '../..'
      const subprocess = execa(
        path.join(__dirname, levelsDown, 'node_modules/.bin/http-server'),
        args
      )
      subprocess.catch(e => console.log(chalk.red(e.stderr)))
      subprocess.stdout.pipe(process.stdout)
    },
  ])
}
