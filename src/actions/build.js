const sequence = require('../helpers/sequence')
const buildHelpers = require('../helpers/build')

module.exports = (clear = false, change = null) => {
  const targetDir = process.cwd() + '/dist'

  let metadata
  return sequence([
    () => clear && buildHelpers.removeFolder(targetDir),
    () => buildHelpers.ensureFolderExists(targetDir),
    () => clear && buildHelpers.copySupportFiles(targetDir),
    () => (clear || change === 'static') && buildHelpers.copyStaticFolder(targetDir),
    () => (clear || change === 'settings') && buildHelpers.copySettings(targetDir),
    () => (clear || change === 'metadata') && buildHelpers.copyMetadata(targetDir),
    () => buildHelpers.readMetadata().then(result => (metadata = result)),
    () => (clear || change === 'src') && buildHelpers.bundleEs6App(targetDir, metadata),
    // todo: make es5 build conditional, because it's quite slow (especially during development)
    () => (clear || change === 'src') && buildHelpers.bundleEs5App(targetDir, metadata),
  ])
}
