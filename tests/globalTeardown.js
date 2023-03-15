const opener = require('opener')
const fs = require('fs-extra')
module.exports = async function(globalConfig, projectConfig) {
  // Clean up the test by deleting the app folder
  fs.removeSync(`${global.appConfig.appPath}`)
  console.log('Finish up tests')
  opener('./tests_report/report.html')
}
