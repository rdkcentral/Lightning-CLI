const inquirer = require('inquirer')
const fs = require('fs-extra')
const path = require('path')
const replaceInFile = require('replace-in-file')

module.exports = () => {
  inquirer
    .prompt([
      {
        name: 'appName',
        message: 'What is the name of your Lightning App?',
        default: 'My Awesome App',
      },
      {
        name: 'appId',
        message: 'What is the App identifier? (reverse-DNS format)',
        default: 'com.metrological.app.myawesomeapp',
      },
    ])
    .then(answers => {
      if (!answers.appName) {
        console.log('Please provide a name for your App')
        process.exit()
      }

      if (!answers.appId) {
        console.log('Please provide an identifier for your App')
        process.exit()
      }

      const appName = answers.appName
      const appId = validateAndPrepAppId(answers.appId)
      if (!appId) {
        console.log('The App identifier is not valid')
        process.exit()
      }

      const targetDir = path.join(process.cwd(), appId)
      if (fs.pathExistsSync(targetDir)) {
        console.log('The target directory', targetDir, 'already exists')
        process.exit()
      }

      fs.copySync(path.join(__dirname, '../../fixtures/lightning-app'), targetDir)

      replaceInFile.sync({
        files: targetDir + '/*',
        from: /\{\$appId\}/g,
        to: appId,
      })

      replaceInFile.sync({
        files: targetDir + '/*',
        from: /\{\$appName\}/g,
        to: appName,
      })

      console.log(' ')
      console.log(' ')
      console.log('===============================================')
      console.log('⚡️ Your Lightning App Blueprint is created!! ⚡️')
      console.log('===============================================')
      console.log(' ')
      console.log('Go to the directory ' + targetDir)
      console.log('And run `npm install` and then `npm start`')
      console.log('================================================')
    })
}

const validateAndPrepAppId = appId => {
  appId = appId.toLowerCase()
  // todo: validate appId

  return appId
}
