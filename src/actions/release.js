const path = require('path')
const sequence = require('../helpers/sequence')
const buildHelpers = require('../helpers/build')
const targz = require('targz')
const spinner = require('../helpers/spinner')
const exit = require('../helpers/exit')

const pack = (distDir, releasesDir, metadata) => {
  const filename = [metadata.identifier, metadata.version, 'tgz'].join('.').replace(/\s/g, '_')
  const target = path.join(releasesDir, filename)

  spinner.start(
    'Creating release package "' + filename + '" in "' + releasesDir.split('/').pop() + '" folder'
  )

  return tar(distDir, target)
    .then(() => {
      spinner.succeed()
      return target
    })
    .catch(e => {
      console.log(e)
      exit()
    })
}

const tar = (src, dest) => {
  return new Promise((resolve, reject) => {
    targz.compress({ src, dest }, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = () => {
  const releasesDir = process.cwd() + '/releases'
  const tmpDir = process.cwd() + '/.tmp'
  let packageData
  return sequence([
    () => buildHelpers.removeFolder(tmpDir),
    () => buildHelpers.ensureFolderExists(tmpDir),
    () => buildHelpers.copyStaticFolder(tmpDir),
    () => buildHelpers.copySrcFolder(tmpDir),
    () => buildHelpers.copyMetadata(tmpDir),
    () =>
      buildHelpers.readMetadata().then(metadata => {
        packageData = metadata
        return metadata
      }),
    // todo: add production flag
    metadata => buildHelpers.bundleEs6App(tmpDir, metadata),
    metadata => buildHelpers.bundleEs5App(tmpDir, metadata),
    () => buildHelpers.ensureFolderExists(releasesDir),
    () => buildHelpers.readMetadata(),
    metadata => pack(tmpDir, releasesDir, metadata),
    tgzFile => (packageData.tgzFile = tgzFile),
    () => buildHelpers.removeFolder(tmpDir),
    () => packageData,
  ])
}
