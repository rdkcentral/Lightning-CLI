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

const isFile = path => {
  try {
    return fs.lstatSync(path).isFile()
  } catch (e) {
    return false
  }
}

const getAsFile = path => {
  const isDir = fs.existsSync(path) && fs.lstatSync(path).isDirectory()
  const extensions = ['js', 'mjs', 'ts']
  const file = extensions
    .reduce((acc, ext) => {
      acc.push(isDir ? `${path}/index.${ext}` : `${path}.${ext}`)
      return acc
    }, [])
    .filter(f => isFile(f))

  return file.length ? file[0] : false
}

module.exports = (entries = []) => {
  return {
    name: 'alias',
    setup(build) {
      entries.forEach(entry => {
        build.onResolve({ filter: entry.filter }, args => {
          let importPath = args.path.replace(entry.find, entry.replace)
          if (!isFile(importPath)) {
            importPath = getAsFile(importPath)
          }
          if (!importPath) {
            throw new Error(
              `Unable to import: ${args.path}
              importer: ${args.importer}`
            )
          }
          return {
            path: importPath,
          }
        })
      })
    },
  }
}
