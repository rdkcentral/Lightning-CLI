const opener = require('opener')
module.exports = async function (globalConfig, projectConfig) {
  console.log('Finish up tests')
  opener('./tests_report/report.html')
};
