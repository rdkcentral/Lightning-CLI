const path = require('path')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const alias = require('@rollup/plugin-alias')
const injectProcessEnv = require('rollup-plugin-inject-process-env')
const buildHelpers = require(path.join(__dirname, '../helpers/build'))
const dotenv = require('dotenv').config()

console.log(dotenv.parsed)

module.exports = {
  plugins: [
    alias({
      entries: {
        'wpe-lightning': path.join(__dirname, '../alias/wpe-lightning.js'),
        '@': path.resolve(process.cwd(), 'src/'),
        '~': path.resolve(process.cwd(), 'node_modules/'),
      },
    }),
    resolve({ mainFields: ['module', 'main', 'browser'] }),
    commonjs({ sourceMap: false }),
    injectProcessEnv({
      NODE_ENV: process.env.NODE_ENV,
      ...buildHelpers.getEnvAppVars(dotenv.parsed),
    }),
  ],
  output: {
    format: 'iife',
    sourcemap:
      process.env.LNG_BUILD_SOURCEMAP === 'undefined'
        ? true
        : process.env.LNG_BUILD_SOURCEMAP === 'false'
        ? false
        : process.env.LNG_BUILD_SOURCEMAP,
  },
}
