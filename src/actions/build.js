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

const path = require('path')
const sequence = require('../helpers/sequence')
const buildHelpers = require('../helpers/build')

module.exports = (clear = false, change = null, types = ['default']) => {
  const targetDir = path.join(process.cwd(), process.env.LNG_BUILD_FOLDER || 'build')

  let settingsFileName = buildHelpers.getSettingsFileName()
  let metadata
  let settings

  const buildES = (test, esEnv, types) => {
    return types.includes('default') && esEnv
      ? (clear || change === 'src') && esEnv === test
      : types.includes('default')
      ? test === 'es6'
      : types.includes(test)
  }

  return sequence([
    () => buildHelpers.ensureLightningApp(),
    () => clear && buildHelpers.ensureCorrectGitIgnore(),
    () => clear && buildHelpers.ensureCorrectSdkDependency(),
    () => clear && buildHelpers.removeFolder(targetDir),
    () => buildHelpers.ensureFolderExists(targetDir),
    () => clear && buildHelpers.copySupportFiles(targetDir),
    () => (clear || change === 'static') && buildHelpers.copyStaticFolder(targetDir),
    () =>
      (clear || change === 'settings') && buildHelpers.copySettings(settingsFileName, targetDir),
    () => (clear || change === 'metadata') && buildHelpers.copyMetadata(targetDir),
    () => buildHelpers.readMetadata().then(result => (metadata = result)),
    () => buildHelpers.readSettings(settingsFileName).then(result => (settings = result)),
    () =>
      (clear || change === 'src') &&
      buildES('es6', settings.platformSettings.esEnv, types) &&
      buildHelpers.bundleEs6App(targetDir, metadata),
    () =>
      (clear || change === 'src') &&
      buildES('es5', settings.platformSettings.esEnv, types) &&
      buildHelpers.bundleEs5App(targetDir, metadata),
  ])
}
