const path = require('path')
const fs = require('fs')
const sequence = require('../helpers/sequence')
const buildHelpers = require('../helpers/build')
const distHelpers = require('../helpers/dist')
const distWatch = require('../helpers/distWatch')

module.exports = options => {
  const baseDistDir = path.join(process.cwd(), process.env.LNG_DIST_FOLDER || 'dist')

  let metadata

  const dist = option => {
    const type = option.type

    let distDir
    return sequence([
      () => distHelpers.moveOldDistFolderToBuildFolder(),
      () => buildHelpers.ensureCorrectGitIgnore(),
      () => buildHelpers.readMetadata().then(result => (metadata = result)),
      () => {
        distDir = path.join(baseDistDir, type)
      },
      () => {
        if (!fs.existsSync(distDir)) {
          return sequence([
            () => buildHelpers.ensureFolderExists(distDir),
            () => buildHelpers.ensureFolderExists(path.join(distDir, 'js')),
            () => distHelpers.setupDistFolder(distDir, type, metadata),
          ])
        }
        return true
      },
      () => buildHelpers.removeFolder(path.join(distDir, 'static')),
      () => buildHelpers.copyStaticFolder(distDir),
      () =>
        type === 'es6' &&
        buildHelpers.bundleEs6App(path.join(distDir, 'js'), metadata, { sourcemaps: false }),
      () =>
        type === 'es5' &&
        buildHelpers.bundleEs5App(path.join(distDir, 'js'), metadata, { sourcemaps: false }),
      () => type === 'es5' && buildHelpers.bundlePolyfills(path.join(distDir, 'js')),
      () => option.isWatchEnabled && distWatch(type),
    ])
  }

  // execute the dist function for all types
  return options.reduce((promise, type) => {
    return promise
      .then(function() {
        return dist(type)
      })
      .catch(Promise.reject)
  }, Promise.resolve(null))
}
