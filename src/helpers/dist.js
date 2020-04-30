const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

const setupDistFolder = (folder, type) => {
  if (type === 'es6') {
    shell.cp(
      path.join(process.cwd(), './node_modules/wpe-lightning/dist/lightning.js'),
      path.join(folder, 'js', 'lightning.js')
    )

    shell.cp(
      path.join(__dirname, '../../fixtures/dist/index.es6.html'),
      path.join(folder, 'index.html')
    )
    return true
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
    return true
  }
}

const moveOldDistFolderToBuildFolder = () => {
  const distFolder = path.join(process.cwd(), 'dist')

  // when dist folder has a metadata.json file we assume it's an old 'built' app
  if (path.join(distFolder, 'metadata.json')) {
    const buildFolder = path.join(process.cwd(), 'build')
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
