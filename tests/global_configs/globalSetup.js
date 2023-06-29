const fs = require('fs-extra')

module.exports = async function() {
  global.setEnvironmentValue = (key, value) => {
    //Check if the .env exists if not create it
    if (!fs.existsSync('.env')) fs.writeFileSync('.env', '')

    // read the contents of the .env file into a string
    let envFile = fs.readFileSync('.env', 'utf-8')

    // split the string into an array of lines
    let envLines = envFile.split('\n')

    // find the line that contains the variable you want to update
    let myVarLine = envLines.findIndex(line => line.startsWith(`${key}=`))

    //when the variable doesn't exists create it.
    if (myVarLine == -1) envLines[envLines.length] = `${key}=${value}`
    // update the value of the variable
    else envLines[myVarLine] = `${key}=${value}`

    // join the lines back into a string and write it to the .env file
    fs.writeFileSync('.env', envLines.join('\n'))
  }

  global.changeSettingsJson = obj => {
    const file = 'settings.json'

    let settingsJson = JSON.parse(fs.readFileSync(file))

    if (obj.platformSettings)
      settingsJson.platformSettings = {
        ...settingsJson.platformSettings,
        ...obj.platformSettings,
      }

    fs.writeFileSync(file, JSON.stringify(settingsJson, null, 2))
    return settingsJson
  }

  global.changeEsEnv = esEnv => {
    const obj = {
      platformSettings: {
        esEnv: esEnv,
      },
    }
    return global.changeSettingsJson(obj)
  }
  global.changeShowVersion = show => {
    const obj = {
      platformSettings: {
        showVersion: show,
      },
    }
    return global.changeSettingsJson(obj)
  }

  global.DelayTest = new Promise(resolve => {
    setTimeout(resolve, 1000)
  })

  const appName = 'My Awesome App'
  global.appConfig = {
    name: appName,
    id: `com.domain.app.${appName.replace(/[^A-Z0-9]/gi, '')}`,
    appPath: process.cwd() + `/com.domain.app.${appName.replace(/[^A-Z0-9]/gi, '')}`,
  }

  global.originalCWD = process.cwd()
}
