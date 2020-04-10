const path = require('path')
const fs = require('fs')
const sequence = require('../helpers/sequence')
const buildHelpers = require('../helpers/build')
const distHelpers = require('../helpers/dist')
const ask = require('../helpers/ask')

const askDistType = () =>
  ask('What type of distributable do you want to create?', null, 'list', [
    'Es6',
    'Es5',
    'Lightning++',
  ])

module.exports = () => {
  const baseDistDir = path.join(process.cwd(), 'dist')

  let type
  let distDir
  return sequence([
    () => buildHelpers.ensureCorrectGitIgnore(),
    () => askDistType().then(val => (type = val.toLowerCase())),
    () => {
      distDir = path.join(baseDistDir, type)
    },
    () => {
      if (!fs.existsSync(distDir)) {
        return sequence([
          () => buildHelpers.ensureFolderExists(distDir),
          () => buildHelpers.ensureFolderExists(path.join(distDir, 'js')),
          () => type === 'lightning++' && distHelpers.ensureSparkShimsInstalled(),
          () => distHelpers.setupDistFolder(distDir, type),
        ])
      }
      return true
    },
    () => buildHelpers.removeFolder(path.join(distDir, 'static')),
    () => buildHelpers.copyStaticFolder(distDir),
    () =>
      type === 'es6' &&
      buildHelpers.bundleEs6App(path.join(distDir, 'js'), {}, { sourcemaps: false }),
    () =>
      type === 'es5' &&
      buildHelpers.bundleEs5App(path.join(distDir, 'js'), {}, { sourcemaps: false }),
    () =>
      type === 'lightning++' &&
      buildHelpers.bundleSparkApp(path.join(distDir, 'js'), {}, { sourcemaps: false }),
  ])
}
