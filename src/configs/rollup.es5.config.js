const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babelPresentEnv = require('@babel/preset-env')
const babelPluginTransFormSpread = require('@babel/plugin-transform-spread')
const babelPluginTransFormParameters = require('@babel/plugin-transform-parameters')

module.exports = {
  plugins: [
    resolve({ mainFields: ['main', 'browser'] }),
    commonjs(),
    babel({
      presets: [
        [
          babelPresentEnv,
          {
            targets: {
              chrome: '44',
            },
            spec: true,
            debug: false,
            useBuiltIns: 'usage',
            corejs: '^2.6.11',
          },
        ],
      ],
      plugins: [babelPluginTransFormSpread, babelPluginTransFormParameters],
    }),
  ],
  output: {
    format: 'iife',
  },
}
