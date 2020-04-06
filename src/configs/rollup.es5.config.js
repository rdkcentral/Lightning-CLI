const path = require('path')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babelPresentEnv = require('@babel/preset-env')
const babelPluginTransFormSpread = require('@babel/plugin-transform-spread')
const babelPluginTransFormParameters = require('@babel/plugin-transform-parameters')
const alias = require('@rollup/plugin-alias')

module.exports = {
  plugins: [
    alias({
      entries: {
        'wpe-lightning': path.join(__dirname, '../alias/wpe-lightning.js'),
        '@': path.resolve(process.cwd(), 'src/'),
        '~': path.resolve(process.cwd(), 'node_modules/'),
      },
    }),
    resolve({ mainFields: ['main', 'browser'] }),
    commonjs({ sourceMap: false }),
    babel({
      presets: [
        [
          babelPresentEnv,
          {
            targets: {
              chrome: '39',
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
    sourcemap: true,
  },
}
