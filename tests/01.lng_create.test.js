const fs = require('fs-extra')
const { addMsg } = require('jest-html-reporters/helper')

const upToDate = require('../src/helpers/uptodate')
const createApp = require('../src/actions/create')
const ask = require('../src/helpers/ask')

jest.mock('is-online', () => jest.fn())

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}))
const inquirer = require('inquirer')

jest.mock('../src/helpers/spinner')

describe('create app without internet', () => {
  let originalExit = process.exit

  beforeAll(async () => {
    process.exit = jest.fn()
  })

  afterAll(async () => {
    process.exit = originalExit
    process.chdir(global.originalCWD)
  })
  beforeEach(() => {
    // Reset the mock Inquirer prompt's resolved value between tests
    inquirer.prompt.mockReset()
  })

  it('should create app without internet', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}`)

    jest.spyOn(console, 'log').mockImplementation(() => {})
    //Return is-online result to be false
    const mockIsOnline = require('is-online')
    mockIsOnline.mockResolvedValue(false)

    //Test for internet
    inquirer.prompt.mockResolvedValueOnce({ q: 'Yes' })
    const result = await upToDate()

    expect(result).toBe(true)
    expect(inquirer.prompt.mock.calls).toHaveLength(1)

    //Create the app without internet
    //Mock the questions asked
    inquirer.prompt.mockReset()
    inquirer.prompt
      .mockResolvedValueOnce({ q: global.appConfig.name }) //What is the name of your Lightning App?
      .mockResolvedValueOnce({ q: global.appConfig.id }) //What is the App identifier?
      .mockResolvedValueOnce({ q: global.appConfig.id }) //In what (relative) folder do you want to create the new App?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to write your App in TypeScript?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to enable ESlint?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to install the NPM dependencies now?
      .mockResolvedValue({ q: 'No' }) //Do you want to initialize an empty GIT repository? (And all questions after this)
    const resultCreate = await createApp()
    await addMsg({ message: JSON.stringify(resultCreate, null, 2) })

    expect(inquirer.prompt.mock.calls).toHaveLength(7)
    expect(resultCreate.appName).toBe(global.appConfig.name)
    expect(resultCreate.appId).toBe(global.appConfig.id)
    expect(resultCreate.appFolder).toBe(global.appConfig.id)
    expect(resultCreate.eslint).toBe(false)
    expect(resultCreate.targetDir).toContain(global.appConfig.id)
    expect(resultCreate.npmInstall).toBe(false)
    expect(resultCreate.gitInit).toBe(false)

    // Assert that the function created the app in the correct folder
    expect(fs.pathExistsSync(`${resultCreate.targetDir}`)).toBe(true)

    // Assert that the function set the correct app data in the files
    expect(fs.existsSync(`${resultCreate.targetDir}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${resultCreate.targetDir}/package.json`)).toBe(true)
    expect(fs.existsSync(`${resultCreate.targetDir}/settings.json`)).toBe(true)
    expect(fs.pathExistsSync(`${resultCreate.targetDir}/static`)).toBe(true)
    expect(fs.pathExistsSync(`${resultCreate.targetDir}/src`)).toBe(true)
  }, 20000)

  it('should create app without name', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}`)

    jest.spyOn(console, 'log').mockImplementation(() => {})

    inquirer.prompt.mockResolvedValueOnce({ q: '' }) //What is the name of your Lightning App?

    let resultAskName = await ask('What is the name of your Lightning App?', 'My Awesome App')
    expect(resultAskName).toBeFalsy()

    const defaultName = inquirer.prompt.mock.calls[0][0][0].default || ''

    inquirer.prompt.mockResolvedValueOnce({
      q: `com.domain.app.${defaultName.replace(/[^A-Z0-9]/gi, '')}`,
    })
    const resultAskId = await ask(
      'What is the App identifier?',
      `com.domain.app.${defaultName.replace(/[^A-Z0-9]/gi, '')}`
    )

    //Reset question responses and create App
    inquirer.prompt.mockReset()
    inquirer.prompt
      .mockResolvedValueOnce({ q: defaultName }) //What is the name of your Lightning App?
      .mockResolvedValueOnce({ q: resultAskId }) //What is the App identifier?
      .mockResolvedValueOnce({ q: resultAskId }) //In what (relative) folder do you want to create the new App?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to write your App in TypeScript?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to enable ESlint?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to install the NPM dependencies now?
      .mockResolvedValue({ q: 'No' }) //Do you want to initialize an empty GIT repository? (And all questions after this)
    const resultCreate = await createApp()
    await addMsg({ message: JSON.stringify(resultCreate, null, 2) })

    expect(inquirer.prompt.mock.calls).toHaveLength(7)
    expect(resultCreate.appName).toBe(defaultName)
    expect(resultCreate.appId).toBe(global.appConfig.id)
    expect(resultCreate.appFolder).toBe(global.appConfig.id)
    expect(resultCreate.eslint).toBe(false)
    expect(resultCreate.targetDir).toContain(global.appConfig.id)
    expect(resultCreate.npmInstall).toBe(false)
    expect(resultCreate.gitInit).toBe(false)

    // Assert that the function created the app in the correct folder
    expect(fs.pathExistsSync(`${resultCreate.targetDir}`)).toBe(true)

    // Assert that the function set the correct app data in the files
    expect(fs.existsSync(`${resultCreate.targetDir}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${resultCreate.targetDir}/package.json`)).toBe(true)
    expect(fs.existsSync(`${resultCreate.targetDir}/settings.json`)).toBe(true)
    expect(fs.pathExistsSync(`${resultCreate.targetDir}/static`)).toBe(true)
    expect(fs.pathExistsSync(`${resultCreate.targetDir}/src`)).toBe(true)
  }, 20000)

  it('should create app with invalid name', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})

    inquirer.prompt.mockResolvedValueOnce({ q: '/invalid|@41' }) //What is the name of your Lightning App?

    let resultAskName = await ask('What is the name of your Lightning App?', 'My Awesome App')
    resultAskName = `${resultAskName.replace(/[^A-Z0-9]/gi, '')}`
    inquirer.prompt.mockResolvedValueOnce({
      q: `com.domain.app.${resultAskName}`,
    })
    const resultAskId = await ask('What is the App identifier?', `com.domain.app.${resultAskName}`)

    //Reset question responses
    inquirer.prompt.mockReset()
    inquirer.prompt
      .mockResolvedValueOnce({ q: '/invalid|@41' }) //What is the name of your Lightning App?
      .mockResolvedValueOnce({ q: resultAskId }) //What is the App identifier?
      .mockResolvedValueOnce({ q: resultAskId }) //In what (relative) folder do you want to create the new App?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to write your App in TypeScript?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to enable ESlint?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to install the NPM dependencies now?
      .mockResolvedValue({ q: 'No' }) //Do you want to initialize an empty GIT repository? (And all questions after this)
    const resultCreate = await createApp()
    await addMsg({ message: JSON.stringify(resultCreate, null, 2) })

    expect(inquirer.prompt.mock.calls).toHaveLength(7)
    expect(resultCreate.appName).toBe('/invalid|@41')
    expect(resultCreate.appId).toBe(resultAskId)
    expect(resultCreate.appFolder).toBe(resultAskId)
    expect(resultCreate.eslint).toBe(false)
    expect(resultCreate.targetDir).toContain(resultAskId)
    expect(resultCreate.npmInstall).toBe(false)
    expect(resultCreate.gitInit).toBe(false)

    // Assert that the function created the app in the correct folder
    expect(fs.pathExistsSync(`${resultCreate.targetDir}`)).toBe(true)

    // Assert that the function set the correct app data in the files
    expect(fs.existsSync(`${resultCreate.targetDir}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${resultCreate.targetDir}/package.json`)).toBe(true)
    expect(fs.existsSync(`${resultCreate.targetDir}/settings.json`)).toBe(true)
    expect(fs.pathExistsSync(`${resultCreate.targetDir}/static`)).toBe(true)
    expect(fs.pathExistsSync(`${resultCreate.targetDir}/src`)).toBe(true)

    // Clean up the test by deleting the app folder
    fs.removeSync(resultCreate.targetDir)
  }, 20000)

  it('should create app', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}`)

    jest.spyOn(console, 'log').mockImplementation(() => {})

    inquirer.prompt
      .mockResolvedValueOnce({ q: global.appConfig.name }) //What is the name of your Lightning App?
      .mockResolvedValueOnce({ q: global.appConfig.id }) //What is the App identifier?
      .mockResolvedValueOnce({ q: global.appConfig.id }) //In what (relative) folder do you want to create the new App?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to write your App in TypeScript?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to enable ESlint?
      .mockResolvedValueOnce({ q: 'Yes' }) //Do you want to install the NPM dependencies now?
      .mockResolvedValue({ q: 'No' }) //Do you want to initialize an empty GIT repository? (And all questions after this)
    const resultCreate = await createApp()
    await addMsg({ message: JSON.stringify(resultCreate, null, 2) })

    expect(inquirer.prompt.mock.calls).toHaveLength(7)
    expect(resultCreate.appName).toBe(global.appConfig.name)
    expect(resultCreate.appId).toBe(global.appConfig.id)
    expect(resultCreate.appFolder).toBe(global.appConfig.id)
    expect(resultCreate.eslint).toBe(false)
    expect(resultCreate.targetDir).toContain(global.appConfig.id)
    expect(resultCreate.npmInstall).toBe(true)
    expect(resultCreate.gitInit).toBe(false)

    // Assert that the function created the app in the correct folder
    expect(fs.pathExistsSync(`${resultCreate.targetDir}`)).toBe(true)

    // Assert that the function set the correct app data in the files
    expect(fs.existsSync(`${resultCreate.targetDir}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${resultCreate.targetDir}/package.json`)).toBe(true)
    expect(fs.existsSync(`${resultCreate.targetDir}/settings.json`)).toBe(true)
    expect(fs.pathExistsSync(`${resultCreate.targetDir}/static`)).toBe(true)
    expect(fs.pathExistsSync(`${resultCreate.targetDir}/src`)).toBe(true)
  }, 20000)
})
