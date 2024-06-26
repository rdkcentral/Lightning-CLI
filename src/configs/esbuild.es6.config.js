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
const os = require('os')
const alias = require('../plugins/esbuild-alias')
const babel = require('../helpers/esbuildbabel')
const babelPresetTypescript = require('@babel/preset-typescript')
const babelPresetEnv = require('@babel/preset-env')
const path = require('path')
const babelPluginClassProperties = require('@babel/plugin-proposal-class-properties')
const babelPluginInlineJsonImport = require('babel-plugin-inline-json-import')
const deepMerge = require('deepmerge')
const fs = require('fs')
const chalk = require('chalk')

let customConfig

if (process.env.LNG_CUSTOM_ESBUILD === 'true') {
  const customConfigPath = path.join(process.cwd(), 'esbuild.es6.config.js')
  if (fs.existsSync(customConfigPath)) {
    customConfig = require(customConfigPath)
  } else {
    console.warn(
      chalk.yellow('\nCustom esbuild config not found while LNG_CUSTOM_ESBUILD is set to true')
    )
  }
}

module.exports = (folder, globalName) => {
  //Load .env config every time build is triggered
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
        {
          find: 'wpe-lightning',
          filter: /^wpe-lightning$/,
          replace: path.join(__dirname, '../alias/wpe-lightning.js'),
        },
        {
          find: '@lightningjs/core',
          filter: /^@lightningjs\/core$/,
          replace: path.join(__dirname, '../alias/lightningjs-core.js'),
        },
        { find: '@', filter: /@\//, replace: path.resolve(process.cwd(), 'src/') },
        { find: '~', filter: /~\//, replace: path.resolve(process.cwd(), 'node_modules/') },
      ]),
      babel({
        config: {
          presets: [
            [
              babelPresetEnv,
              {
                targets: {
                  safari: '12.0',
                },
              },
            ],
            [babelPresetTypescript],
          ],
          plugins: [babelPluginClassProperties, babelPluginInlineJsonImport],
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
    outfile: `${folder}/appBundle.js`,
    mainFields: buildHelpers.getResolveConfigForBundlers(),
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
    target: process.env.LNG_BUNDLER_TARGET || '',
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
  if (customConfig && 'entryPoints' in customConfig) {
    delete defaultConfig.entryPoints
  }
  const finalConfig = customConfig ? deepMerge(defaultConfig, customConfig) : defaultConfig
  return finalConfig
}
