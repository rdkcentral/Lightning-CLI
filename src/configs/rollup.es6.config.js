const path = require('path')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const alias = require('@rollup/plugin-alias')

module.exports = {
  plugins: [
    alias({
      entries: {
        'wpe-lightning': path.join(__dirname, '../alias/wpe-lightning.js'),
      },
    }),
    resolve({ mainFields: ['main', 'browser'] }),
    commonjs({ sourceMap: false }),
  ],
  output: {
    format: 'iife',
    sourcemap: true,
  },
}
