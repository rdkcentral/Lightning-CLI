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

const buildHelpers = require('../helpers/build')
const alias = require('../plugins/esbuild-alias')
const babel = require('../helpers/esbuildbabel')
const babelPresetTypescript = require('@babel/preset-typescript')
const os = require('os')
const path = require('path')
const babelPresetEnv = require('@babel/preset-env')
const babelPluginTransFormSpread = require('@babel/plugin-transform-spread')
const babelPluginTransFormParameters = require('@babel/plugin-transform-parameters')
const babelPluginClassProperties = require('@babel/plugin-proposal-class-properties')
const babelPluginInlineJsonImport = require('babel-plugin-inline-json-import')
const deepMerge = require('deepmerge')

let customConfig

if (process.env.LNG_CUSTOM_ESBUILD === 'true') {
  customConfig = require(path.join(process.cwd(), 'esbuild.es5.config'))
}

module.exports = (folder, globalName) => {
  // Load .env config every time build is triggered
  const appVars = {
    NODE_ENV: process.env.NODE_ENV,
    ...buildHelpers.getEnvAppVars(process.env),
  }
  const keys = Object.keys(appVars)
  const defined = keys.reduce((acc, key) => {
    acc[`process.env.${key}`] = `"${appVars[key]}"`
    return acc
  }, {})
  defined['process.env.NODE_ENV'] = `"${process.env.NODE_ENV}"`
  const minify = process.env.LNG_BUILD_MINIFY === 'true' || process.env.NODE_ENV === 'production'

  let defaultConfig = {
    plugins: [
      alias([
        { find: '@', filter: /@\//, replace: path.resolve(process.cwd(), 'src/') },
        { find: '~', filter: /~\//, replace: path.resolve(process.cwd(), 'node_modules/') },
        {
          find: '@lightningjs/core',
          filter: /^@lightningjs\/core$/,
          replace: path.join(__dirname, '../alias/lightningjs-core.js'),
        },
        {
          find: 'wpe-lightning',
          filter: /^wpe-lightning$/,
          replace: path.join(__dirname, '../alias/wpe-lightning.js'),
        },
      ]),
      babel({
        config: {
          presets: [
            [
              babelPresetEnv,
              {
                targets: {
                  chrome: '39',
                },
                debug: false,
                useBuiltIns: 'entry',
                corejs: '^3.6.5',
              },
            ],
            [babelPresetTypescript],
          ],
          plugins: [
            babelPluginClassProperties,
            babelPluginTransFormSpread,
            babelPluginTransFormParameters,
            babelPluginInlineJsonImport,
          ],
        },
      }),
    ],
    logLevel: 'silent',
    minifyWhitespace: minify,
    minifyIdentifiers: minify,
    minifySyntax: false,
    keepNames: minify,
    entryPoints: [`${process.cwd()}/src/index.js`],
    bundle: true,
    target: 'es5',
    mainFields: buildHelpers.getResolveConfigForBundlers(),
    outfile: `${folder}/appBundle.es5.js`,
    sourcemap:
      process.env.NODE_ENV === 'production'
        ? 'external'
        : process.env.LNG_BUILD_SOURCEMAP === 'inline'
        ? 'inline'
        : process.env.LNG_BUILD_SOURCEMAP === 'false'
        ? ''
        : 'external',
    format: 'iife',
    define: defined,
    globalName,
    banner: {
      js: [
        '/*',
        ` App version: ${buildHelpers.getAppVersion()}`,
        ` SDK version: ${buildHelpers.getSdkVersion()}`,
        ` CLI version: ${buildHelpers.getCliVersion()}`,
        '',
        ` gmtDate: ${new Date().toGMTString()}`,
        '*/',
      ].join(os.EOL),
    },
  }
  if ('entryPoints' in customConfig) {
    delete defaultConfig.entryPoints
  }
  const finalConfig = customConfig ? deepMerge(defaultConfig, customConfig) : defaultConfig
  return finalConfig
}
