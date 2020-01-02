const sequence = require('../helpers/sequence')
const buildHelpers = require('../helpers/build')

module.exports = (clear = false) => {
  const targetDir = process.cwd() + '/dist'
  return sequence([
    () => clear && buildHelpers.removeFolder(targetDir),
    () => buildHelpers.ensureFolderExists(targetDir),
    () => clear && buildHelpers.copySupportFiles(targetDir),
    () => buildHelpers.copyStaticFolder(targetDir),
    () => buildHelpers.copySettings(targetDir),
    () => buildHelpers.copyMetadata(targetDir),
    () => buildHelpers.readMetadata(),
    metadata => buildHelpers.bundleEs6App(targetDir, metadata),
    metadata => buildHelpers.bundleEs5App(targetDir, metadata),
  ])
}
