const spinner = require('../src/helpers/spinner')
const watch = require('watch')
const createApp = require('../src/actions/create')
const inquirer = require('inquirer')

jest.mock('is-online', () => jest.fn())

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}))
jest.mock('watch')

describe('watch', () => {
  let watchCallback
  let initCallback
  let originalExit = process.exit
  let watchFolder
  beforeEach(async () => {
    spinner.start.mockReset()
    inquirer.prompt
      .mockResolvedValueOnce({ q: global.appConfig.name }) //What is the name of your Lightning App?
      .mockResolvedValueOnce({ q: global.appConfig.id }) //What is the App identifier?
      .mockResolvedValueOnce({ q: global.appConfig.id }) //In what (relative) folder do you want to create the new App?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to write your App in TypeScript?
      .mockResolvedValueOnce({ q: 'No' }) //Do you want to enable ESlint?
      .mockResolvedValueOnce({ q: 'Yes' }) //Do you want to install the NPM dependencies now?
      .mockResolvedValue({ q: 'No' }) //Do you want to initialize an empty GIT repository? (And all questions after this)
    await createApp()
    process.chdir(global.appConfig.appPath)
    watchFolder = `${process.cwd()}/src`
    process.exit = jest.fn()
  }, 30000)

  afterAll(async () => {
    process.exit = originalExit
    process.chdir(global.originalCWD)
  })

  beforeEach(() => {
    // Reset the mocks and clear any mock function calls
    jest.clearAllMocks()

    spinner.start.mockReset()
    // Reset the callbacks
    watchCallback = jest.fn()
    initCallback = jest.fn().mockResolvedValue()
  })

  test('Should watch for file changes and automatically rebuild the App', async () => {
    const { watchTree } = watch

    // Mock watch.watchTree to simulate file changes
    watchTree.mockImplementationOnce((dir, options, callback) => {
      callback(`${watchFolder}/index.js`, {}, {})
    })

    // Call the function being tested
    const result = await require('../src/actions/watch')(initCallback, watchCallback)

    // Assert that the initCallback is not called
    expect(initCallback).not.toHaveBeenCalled()

    // Assert that the watchCallback is called
    expect(watchCallback).toHaveBeenCalled()

    // Assert that the result is the same as the watch object
    expect(result).toBe(watch)
  }, 50000)
})
