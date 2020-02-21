const sequence = require('../helpers/sequence')
const buildHelpers = require('../helpers/build')

module.exports = (clear = false, change = null) => {
  const targetDir = process.cwd() + '/dist'

  let metadata
  let settings
  return sequence([
    () => clear && buildHelpers.removeFolder(targetDir),
    () => buildHelpers.ensureFolderExists(targetDir),
    () => clear && buildHelpers.copySupportFiles(targetDir),
    () => (clear || change === 'static') && buildHelpers.copyStaticFolder(targetDir),
    () => (clear || change === 'settings') && buildHelpers.copySettings(targetDir),
    () => (clear || change === 'metadata') && buildHelpers.copyMetadata(targetDir),
    () => buildHelpers.readMetadata().then(result => (metadata = result)),
    () => buildHelpers.readSettings().then(result => (settings = result)),
    () =>
      (clear || change === 'src') &&
      (settings.platformSettings.esEnv || 'es6') === 'es6' &&
      buildHelpers.bundleEs6App(targetDir, metadata),
    () =>
      (clear || change === 'src') &&
      settings.platformSettings.esEnv === 'es5' &&
      buildHelpers.bundleEs5App(targetDir, metadata),
  ])
}
