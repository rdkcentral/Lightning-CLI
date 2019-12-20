const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

module.exports = {
  plugins: [
    resolve({ mainFields: ['main', 'browser'] }),
    commonjs(),
    babel({
      presets: [
        [
          '@babel/env',
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
      plugins: ['@babel/plugin-transform-spread', '@babel/plugin-transform-parameters'],
    }),
  ],
  output: {
    format: 'iife',
  },
}
