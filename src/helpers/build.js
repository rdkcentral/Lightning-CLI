const shell = require('shelljs')
const fs = require('fs')
const execa = require('execa')
const path = require('path')

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
  shell.cp('./node_modules/wpe-lightning/dist/lightning.js', folder)
  // lightning es5 bundle in dist didn't exist in earlier versions (< 1.3.1)
  if (fs.existsSync('./node_modules/wpe-lightning/dist/lightning.es5.js')) {
    shell.cp('./node_modules/wpe-lightning/dist/lightning.es5.js', folder)
  }
  shell.cp('./node_modules/wpe-lightning/devtools/lightning-inspect.js', folder)
  shell.cp('./node_modules/wpe-lightning-sdk/support/startApp.js', folder)
  shell.cp('./node_modules/wpe-lightning-sdk/support/index.html', folder)
  // polyfills didn't exist in all versions of the SDK
  if (fs.existsSync('./node_modules/wpe-lightning-sdk/support/polyfills')) {
    shell.cp('-r', './node_modules/wpe-lightning-sdk/support/polyfills', folder)
  }
  spinner.succeed()
}

const copyStaticFolder = folder => {
  spinner.start('Copying static assets to "' + folder.split('/').pop() + '"')
  shell.cp('-r', './static', folder)
  spinner.succeed()
}

const copySrcFolder = folder => {
  shell.cp('-r', './src', folder)
}

const copySettings = folder => {
  const file = './settings.json'
  if (fs.existsSync(file)) {
    spinner.start('Copying settings.json "' + folder.split('/').pop() + '"')
    shell.cp(file, folder)
    spinner.succeed()
  }
}

const copyMetadata = folder => {
  const file = './metadata.json'
  if (fs.existsSync(file)) {
    spinner.start('Copying metadata.json "' + folder.split('/').pop() + '"')
    shell.cp(file, folder)
    spinner.succeed()
  }
}

const readMetadata = () => {
  return new Promise(resolve => {
    const metadata = fs.readFileSync('./metadata.json', 'utf8')
    resolve(JSON.parse(metadata))
  })
}

const readSettings = () => {
  return new Promise(resolve => {
    const settings = fs.readFileSync('./settings.json', 'utf8')
    resolve(JSON.parse(settings))
  })
}

const bundleEs6App = (folder, metadata) => {
  spinner.start('Building ES6 appBundle and saving to "' + folder.split('/').pop() + '"')

  return execa(path.join(__dirname, '../..', 'node_modules/.bin/rollup'), [
    '-c',
    path.join(__dirname, '../configs/rollup.es6.config.js'),
    '--input',
    path.join(process.cwd(), 'src/index.js'),
    '--file',
    path.join(folder, 'appBundle.js'),
    '--name',
    'APP_' + metadata.identifier.replace(/\./g, '_').replace(/-/g, '_'),
  ])
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

  return execa(path.join(__dirname, '../..', 'node_modules/.bin/rollup'), [
    '-c',
    path.join(__dirname, '../configs/rollup.es5.config.js'),
    '--input',
    path.join(process.cwd(), 'src/index.js'),
    '--file',
    path.join(folder, 'appBundle.es5.js'),
    '--name',
    'APP_' + metadata.identifier.replace(/\./g, '_').replace(/-/g, '_'),
  ])
    .then(() => {
      spinner.succeed()
      return metadata
    })
    .catch(e => {
      console.log(e)
      exit()
    })
}

module.exports = {
  removeFolder,
  ensureFolderExists,
  copySupportFiles,
  copyStaticFolder,
  copySrcFolder,
  copySettings,
  copyMetadata,
  readMetadata,
  readSettings,
  bundleEs6App,
  bundleEs5App,
}
