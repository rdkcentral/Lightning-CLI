const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const replaceInFile = require('replace-in-file')
const buildHelpers = require('./build')

const setupDistFolder = (folder, type, metadata) => {
  if (type === 'es6') {
    shell.cp(
      path.join(process.cwd(), './node_modules/wpe-lightning/dist/lightning.js'),
      path.join(folder, 'js', 'lightning.js')
    )

    shell.cp(
      path.join(__dirname, '../../fixtures/dist/index.es6.html'),
      path.join(folder, 'index.html')
    )
  }
  if (type === 'es5') {
    const lightningFile = path.join(
      process.cwd(),
      './node_modules/wpe-lightning/dist/lightning.es5.js'
    )
    // lightning es5 bundle in dist didn't exist in earlier versions (< 1.3.1)
    if (fs.existsSync(lightningFile)) {
      shell.cp(lightningFile, path.join(folder, 'js', 'lightning.es5.js'))
    }

    shell.cp(
      path.join(__dirname, '../../fixtures/dist/index.es5.html'),
      path.join(folder, 'index.html')
    )
  }

  const settingsJsonFile = path.join(process.cwd(), 'settings.json')

  const settings = fs.existsSync(settingsJsonFile)
    ? JSON.parse(fs.readFileSync(settingsJsonFile, 'utf8'))
    : {
        appSettings: {
          stage: {
            clearColor: '0x00000000',
            useImageWorker: true,
          },
        },
        platformSettings: {
          path: './static',
        },
      }

  replaceInFile.sync({
    files: folder + '/*',
    from: /\{\$APPSETTINGS\}/g,
    to: JSON.stringify(settings.appSettings, null, 2),
  })

  replaceInFile.sync({
    files: folder + '/*',
    from: /\{\$PLATFORMSETTINGS\}/g,
    to: JSON.stringify(settings.platformSettings, null, 2),
  })

  replaceInFile.sync({
    files: folder + '/*',
    from: /\{\$APP_ID\}/g,
    to: buildHelpers.makeSafeAppId(metadata),
  })
}

const moveOldDistFolderToBuildFolder = () => {
  const distFolder = path.join(process.cwd(), process.env.LNG_DIST_FOLDER || 'dist')

  // when dist folder has a metadata.json file we assume it's an old 'built' app
  if (fs.existsSync(path.join(distFolder, 'metadata.json'))) {
    const buildFolder = path.join(process.cwd(), process.env.LNG_BUILD_FOLDER || 'build')
    // move to build folder if it doesn't exist yet
    if (!fs.existsSync(buildFolder)) {
      shell.mv(distFolder, buildFolder)
    } else {
      // otherwise just remove the old style dist folder
      shell.rm('-rf', distFolder)
    }
  }
}

module.exports = {
  setupDistFolder,
  moveOldDistFolderToBuildFolder,
}
