const buildHelpers = require('../helpers/build')
const os = require('os')

module.exports = (folder, globalName) => {
  const sourcemap =
    process.env.LNG_BUILD_SOURCEMAP === 'true'
      ? true
      : process.env.LNG_BUILD_SOURCEMAP === 'inline'
      ? 'inline'
      : false

  return {
    entryPoints: [`${process.cwd()}/src/index.js`],
    bundle: true,
    outfile: `${folder}/appBundle.es5.js`,
    minifyWhitespace: true,
    sourcemap,
    format: 'iife',
    globalName,
    banner: [
      '/*',
      ` App version: ${buildHelpers.getAppVersion()}`,
      ` SDK version: ${buildHelpers.getSdkVersion()}`,
      ` CLI version: ${buildHelpers.getCliVersion()}`,
      '',
      ` gmtDate: ${new Date().toGMTString()}`,
      '*/',
    ].join(os.EOL),
  }
}
