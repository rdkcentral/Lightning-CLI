const spinner = require('../src/helpers/spinner')
const watch = require('watch')

jest.mock('watch')

describe('watch', () => {
  let watchCallback
  let initCallback
  let originalExit = process.exit
  let watchFolder

  beforeAll(async () => {
    process.chdir(global.appConfig.appPath)
    watchFolder = `${process.cwd()}/src`
    process.exit = jest.fn()
  })

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
  })
})
