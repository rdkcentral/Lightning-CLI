const buildHelpers = require('./build')
const watch = require('watch')
const sequence = require('../helpers/sequence')
const path = require('path')

const regexp = /^(?!src|static)(.+)$/

let metadata

const distWatch = type => {
  let busy = false
  return watch.watchTree(
    './',
    {
      interval: 1,
      filter(f) {
        return !!!regexp.test(f)
      },
      ignoreDirectoryPattern: /node_modules|\.git|dist|build/,
    },
    (f, curr, prev) => {
      // prevent initiating another dist when already busy
      if (busy === true) {
        return
      }
      //Ignore the dist for the first time as there will be no changes
      if (typeof f == 'object' && prev === null && curr === null) {
        console.log('')
      } else {
        busy = true
        // pass the 'type of change' based on the file that was changes
        let change
        if (/^src/g.test(f)) {
          change = 'src'
        }
        if (/^static/g.test(f)) {
          change = 'static'
        }
        updateDistFolder(change, type)
        busy = false
      }
    }
  )
}

/**
 * Updates the dist folder with latest bundles/staticfolder based on the changes in the src or static folders
 * @param change
 * @param type
 */
const updateDistFolder = (change = null, type) => {
  const baseDistDir = path.join(process.cwd(), process.env.LNG_DIST_FOLDER || 'dist')
  const distDir = path.join(baseDistDir, type)
  sequence([
    () => buildHelpers.readMetadata().then(result => (metadata = result)),
    () => change === 'static' && buildHelpers.copyStaticFolder(distDir),
    () =>
      (change === 'static' || change === 'src') &&
      type === 'es6' &&
      buildHelpers.bundleEs6App(path.join(distDir, 'js'), metadata, { sourcemaps: false }),
    () =>
      (change === 'static' || change === 'src') &&
      type === 'es5' &&
      buildHelpers.bundleEs5App(path.join(distDir, 'js'), metadata, { sourcemaps: false }),
  ])
}

module.exports = distWatch
