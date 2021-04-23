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
const targz = require('targz')
const spinner = require('../helpers/spinner')
const exit = require('../helpers/exit')

const pack = (buildDir, releasesDir, metadata) => {
  const filename = [metadata.identifier, metadata.version, 'tgz'].join('.').replace(/\s/g, '_')
  const target = path.join(releasesDir, filename)

  spinner.start(
    'Creating release package "' + filename + '" in "' + releasesDir.split('/').pop() + '" folder'
  )

  return tar(buildDir, target)
    .then(() => {
      spinner.succeed()
      return target
    })
    .catch(e => {
      console.log(`Error occurred while creating release package\n\n${e}`)
      exit()
    })
}

const tar = (src, dest) => {
  return new Promise((resolve, reject) => {
    targz.compress({ src, dest }, err => {
      if (err) {
        console.log(`Error while compressing the tar file. Error is : ${err}`)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = () => {
  // set environment to production (to enable minify)
  process.env.NODE_ENV = 'production'
  const releasesDir = path.join(process.cwd(), 'releases')
  const tmpDir = path.join(process.cwd(), '/.tmp')
  let packageData
  return sequence([
    () => buildHelpers.removeFolder(tmpDir),
    () => buildHelpers.ensureFolderExists(tmpDir),
    () => buildHelpers.copyStaticFolder(tmpDir),
    () => buildHelpers.copySrcFolder(tmpDir),
    () => buildHelpers.copyMetadata(tmpDir),
    () =>
      buildHelpers.readMetadata().then(metadata => {
        packageData = metadata
        return metadata
      }),
    metadata => buildHelpers.bundleEs6App(tmpDir, metadata),
    metadata => buildHelpers.bundleEs5App(tmpDir, metadata),
    () => buildHelpers.ensureFolderExists(releasesDir),
    () => buildHelpers.readMetadata(),
    metadata => pack(tmpDir, releasesDir, metadata),
    tgzFile => (packageData.tgzFile = tgzFile),
    () => buildHelpers.removeFolder(tmpDir),
    () => packageData,
  ])
}
