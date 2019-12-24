const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

module.exports = {
  plugins: [resolve({ mainFields: ['main', 'browser'] }), commonjs(), babel()],
  output: {
    format: 'iife',
    sourcemap: true,
  },
}
