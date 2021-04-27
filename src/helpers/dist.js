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
const shell = require('shelljs')
const replaceInFile = require('replace-in-file')
const buildHelpers = require('./build')

const setupDistFolder = (folder, type, metadata) => {
  const nodeModulesPath = buildHelpers.hasNewSDK()
    ? path.join(process.cwd(), 'node_modules/@lightningjs/core')
    : path.join(process.cwd(), 'node_modules/wpe-lightning/')

  const settingsFileName = buildHelpers.getSettingsFileName()

  if (type === 'es6') {
    shell.cp(
      path.join(nodeModulesPath, 'dist/lightning.js'),
      path.join(folder, 'js', 'lightning.js')
    )

    shell.cp(
      path.join(__dirname, '../../fixtures/dist/index.es6.html'),
      path.join(folder, 'index.html')
    )
  }
  if (type === 'es5') {
    const lightningFile = path.join(nodeModulesPath, 'dist/lightning.es5.js')
    // lightning es5 bundle in dist didn't exist in earlier versions (< 1.3.1)
    if (fs.existsSync(lightningFile)) {
      shell.cp(lightningFile, path.join(folder, 'js', 'lightning.es5.js'))
    }

    shell.cp(
      path.join(__dirname, '../../fixtures/dist/index.es5.html'),
      path.join(folder, 'index.html')
    )
  }

  const settingsJsonFile = path.join(process.cwd(), settingsFileName)

  const settings = fs.existsSync(settingsJsonFile)
    ? JSON.parse(fs.readFileSync(settingsJsonFile, 'utf8'))
    : {
        appSettings: {
          stage: {
            clearColor: '0x00000000',
            useImageWorker: true,
          },
        },
        platformSettings: {
          path: './static',
        },
      }

  //Adding complete metadata info to app settings
  Object.assign(settings.appSettings, metadata)

  //To align with the production response, adding the 'identifier' as 'id'
  settings.appSettings.id = metadata.identifier

  replaceInFile.sync({
    files: folder + '/*',
    from: /\{\$APPSETTINGS\}/g,
    to: JSON.stringify(settings.appSettings, null, 2),
  })

  replaceInFile.sync({
    files: folder + '/*',
    from: /\{\$PLATFORMSETTINGS\}/g,
    to: JSON.stringify(settings.platformSettings, null, 2),
  })

  replaceInFile.sync({
    files: folder + '/*',
    from: /\{\$APP_ID\}/g,
    to: buildHelpers.makeSafeAppId(metadata),
  })
}

const moveOldDistFolderToBuildFolder = () => {
  const distFolder = path.join(process.cwd(), process.env.LNG_DIST_FOLDER || 'dist')

  // when dist folder has a metadata.json file we assume it's an old 'built' app
  if (fs.existsSync(path.join(distFolder, 'metadata.json'))) {
    const buildFolder = path.join(process.cwd(), process.env.LNG_BUILD_FOLDER || 'build')
    // move to build folder if it doesn't exist yet
    if (!fs.existsSync(buildFolder)) {
      shell.mv(distFolder, buildFolder)
    } else {
      // otherwise just remove the old style dist folder
      shell.rm('-rf', distFolder)
    }
  }
}

module.exports = {
  setupDistFolder,
  moveOldDistFolderToBuildFolder,
}
