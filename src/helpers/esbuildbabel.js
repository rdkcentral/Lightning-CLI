/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * ISC License
 * Copyright (c) Antoine Boulanger (https://github.com/antoineboulanger)
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
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
