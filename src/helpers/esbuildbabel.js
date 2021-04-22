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
 *
 */

/**
 * Copyright (c) Antoine Boulanger (https://github.com/antoineboulanger)
 * Licensed under the ISC License
 */
const babel = require('@babel/core')
const fs = require('fs')
const path = require('path')

const pluginBabel = (options = {}) => ({
  name: 'babel',
  setup(build, { transform } = {}) {
    const { filter = /.*/, namespace = '', config = {} } = options

    const transformContents = ({ args, contents }) => {
      const babelOptions = babel.loadOptions({
        ...config,
        filename: args.path,
        caller: {
          name: 'esbuild-plugin-babel',
          supportsStaticESM: true,
        },
      })

      if (babelOptions.sourceMaps) {
        const filename = path.relative(process.cwd(), args.path)

        babelOptions.sourceFileName = filename
      }

      return new Promise((resolve, reject) => {
        babel.transform(contents, babelOptions, (error, result) => {
          error ? reject(error) : resolve({ contents: result.code })
        })
      })
    }

    if (transform) return transformContents(transform)

    build.onLoad({ filter, namespace }, async args => {
      const contents = await fs.promises.readFile(args.path, 'utf8')

      return transformContents({ args, contents })
    })
  },
})

module.exports = pluginBabel
