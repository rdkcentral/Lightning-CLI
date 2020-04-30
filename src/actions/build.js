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

const sequence = require('../helpers/sequence')
const buildHelpers = require('../helpers/build')

module.exports = (clear = false, change = null) => {
  const targetDir = process.cwd() + '/dist'

  let metadata
  let settings
  return sequence([
    () => clear && buildHelpers.removeFolder(targetDir),
    () => buildHelpers.ensureFolderExists(targetDir),
    () => clear && buildHelpers.copySupportFiles(targetDir),
    () => (clear || change === 'static') && buildHelpers.copyStaticFolder(targetDir),
    () => (clear || change === 'settings') && buildHelpers.copySettings(targetDir),
    () => (clear || change === 'metadata') && buildHelpers.copyMetadata(targetDir),
    () => buildHelpers.readMetadata().then(result => (metadata = result)),
    () => buildHelpers.readSettings().then(result => (settings = result)),
    () =>
      (clear || change === 'src') &&
      (settings.platformSettings.esEnv || 'es6') === 'es6' &&
      buildHelpers.bundleEs6App(targetDir, metadata),
    () =>
      (clear || change === 'src') &&
      settings.platformSettings.esEnv === 'es5' &&
      buildHelpers.bundleEs5App(targetDir, metadata),
  ])
}
