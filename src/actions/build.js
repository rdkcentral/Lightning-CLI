const shell = require('shelljs')
const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const sequence = require('../helpers/sequence')
const spinner = require('../helpers/spinner')
const exit = require('../helpers/exit')

const removeFolder = folder => {
  spinner.start('Removing "' + folder.split('/').pop() + '" folder')
  shell.rm('-rf', folder)
  spinner.succeed()
}

const ensureFolderExists = folder => {
  spinner.start('Ensuring "' + folder.split('/').pop() + '" folder exists')
  shell.mkdir('-p', folder)
  spinner.succeed()
}

const copySupportFiles = folder => {
  spinner.start('Copying support files to "' + folder.split('/').pop() + '"')
  shell.cp('./node_modules/wpe-lightning/dist/lightning.js', './dist')
  shell.cp('./node_modules/wpe-lightning/devtools/lightning-inspect.js', './dist')
  shell.cp('./node_modules/wpe-lightning-sdk/support/startApp.js', './dist')
  shell.cp('./node_modules/wpe-lightning-sdk/support/index.html', './dist')
  spinner.succeed()
}

const copyStaticFolder = folder => {
  spinner.start('Copying static assets to "' + folder.split('/').pop() + '"')
  shell.cp('-r', './static', './dist')
  spinner.succeed()
}

const copySettings = folder => {
  const file = './settings.json'
  if (fs.existsSync(file)) {
    spinner.start('Copying settings.json "' + folder.split('/').pop() + '"')
    shell.cp(file, './dist')
    spinner.succeed()
  }
}

const copyMetadata = folder => {
  const file = './metadata.json'
  if (fs.existsSync(file)) {
    spinner.start('Copying metadata.json "' + folder.split('/').pop() + '"')
    shell.cp(file, './dist')
    spinner.succeed()
  }
}

const readMetadata = () => {
  return new Promise(resolve => {
    const metadata = fs.readFileSync('./metadata.json', 'utf8')
    resolve(JSON.parse(metadata))
  })
}

const bundleEs6App = (folder, metadata) => {
  spinner.start('Building ES6 appBundle and saving to "' + folder.split('/').pop() + '"')

  const inputOptions = {
    input: './src/index.js',
    plugins: [resolve({ mainFields: ['main', 'browser'] }), commonjs(), babel()],
  }

  const outputOptions = {
    format: 'iife',
    name: 'APP_' + metadata.identifier.replace(/\./g, '_').replace(/-/, '_'),
    file: folder + '/appBundle.js',
  }

  return bundleApp(inputOptions, outputOptions)
    .then(() => {
      spinner.succeed()
      return metadata
    })
    .catch(e => {
      console.log(e)
      exit()
    })
}

const bundleEs5App = (folder, metadata) => {
  spinner.start('Building ES5 appBundle and saving to "' + folder.split('/').pop() + '"')

  const inputOptions = {
    input: './src/index.js',
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
        // plugins: ['@babel/plugin-transform-spread', '@babel/plugin-transform-parameters'],
      }),
    ],
  }

  const outputOptions = {
    format: 'iife',
    name: 'APP_' + metadata.identifier.replace(/\./g, '_').replace(/-/, '_'),
    file: folder + '/appBundle.es5.js',
  }

  return bundleApp(inputOptions, outputOptions)
    .then(() => {
      spinner.succeed()
      return metadata
    })
    .catch(e => {
      console.log(e)
      exit()
    })
}

const bundleApp = (inputOptions, outputOptions) =>
  new Promise((resolve, reject) => {
    return rollup
      .rollup(inputOptions)
      .then(bundle => {
        return bundle
          .generate(outputOptions)
          .then(() => {
            bundle
              .write(outputOptions)
              .then(resolve)
              .catch(reject)
          })
          .catch(reject)
      })
      .catch(reject)
  })

module.exports = (clear = false) => {
  const targetDir = process.cwd() + '/dist'
  sequence([
    () => clear && removeFolder(targetDir),
    () => ensureFolderExists(targetDir),
    () => clear && copySupportFiles(targetDir),
    () => copyStaticFolder(targetDir),
    () => copySettings(targetDir),
    () => copyMetadata(targetDir),
    () => readMetadata(),
    metadata => bundleEs6App(targetDir, metadata),
    metadata => bundleEs5App(targetDir, metadata),
  ])
}
