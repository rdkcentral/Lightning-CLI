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
const fs = require('fs')
const sequence = require('../helpers/sequence')
const buildHelpers = require('../helpers/build')
const distHelpers = require('../helpers/dist')
const distWatch = require('../helpers/distWatch')

module.exports = options => {
  const baseDistDir = path.join(process.cwd(), process.env.LNG_DIST_FOLDER || 'dist')

  let metadata
  let settingsFileName = buildHelpers.getSettingsFileName()
  let settings

  const buildES = (type, esEnv) => {
    return !!(type || esEnv)
  }

  const dist = (type, config) => {
    let distDir
    return sequence([
      () => buildHelpers.ensureLightningApp(),
      () => distHelpers.moveOldDistFolderToBuildFolder(),
      () => buildHelpers.ensureCorrectGitIgnore(),
      () => buildHelpers.readMetadata().then(result => (metadata = result)),
      () => buildHelpers.readSettings(settingsFileName).then(result => (settings = result)),
      () =>
        (type = !type.includes('defaults')
          ? type
          : settings.platformSettings.esEnv
          ? settings.platformSettings.esEnv
          : 'es6'),
      () => {
        distDir = path.join(baseDistDir, type)
      },
      () => {
        if (!fs.existsSync(distDir)) {
          return sequence([
            () => buildHelpers.ensureFolderExists(distDir),
            () => buildHelpers.ensureFolderExists(path.join(distDir, 'js')),
            () => distHelpers.setupDistFolder(distDir, type, metadata),
          ])
        }
        return true
      },
      () => buildHelpers.removeFolder(path.join(distDir, 'static')),
      () => buildHelpers.copyStaticFolder(distDir),
      () =>
        type === 'es6' &&
        buildES('es6', settings.platformSettings.esEnv) &&
        buildHelpers.bundleEs6App(path.join(distDir, 'js'), metadata),
      () =>
        type === 'es5' &&
        buildES('es5', settings.platformSettings.esEnv) &&
        buildHelpers.bundleEs5App(path.join(distDir, 'js'), metadata),
      () => type === 'es5' && buildHelpers.bundlePolyfills(path.join(distDir, 'js')),
      () => config.isWatchEnabled && distWatch(type),
    ])
  }

  // execute the dist function for all types
  return options.types.reduce((promise, type) => {
    return promise
      .then(function() {
        return dist(type, options)
      })
      .catch(e => Promise.reject(e))
  }, Promise.resolve(null))
}
