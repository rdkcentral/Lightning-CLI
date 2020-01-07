const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

module.exports = {
  plugins: [resolve({ mainFields: ['main', 'browser'] }), commonjs({ sourceMap: false })],
  output: {
    format: 'iife',
    sourcemap: true,
  },
}
