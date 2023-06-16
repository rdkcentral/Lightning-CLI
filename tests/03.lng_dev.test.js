const dev = require('../src/actions/dev')
const watch = require('../src/actions/watch')
const serve = require('../src/actions/serve')
const buildHelpers = require('../src/helpers/build')

jest.mock('../src/actions/watch')
jest.mock('../src/actions/serve')
jest.mock('../src/helpers/build')

describe('dev', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call all necessary functions in the correct order', async () => {
    const ensureLightningAppMock = jest
      .spyOn(buildHelpers, 'ensureLightningApp')
      .mockImplementation(() => {})

    const logMock = jest.spyOn(console, 'log')
    watch.mockImplementation((serveFn, callback) => {
      serveFn()
      callback()
    })

    await dev()

    expect(ensureLightningAppMock).toHaveBeenCalled()
    expect(watch).toHaveBeenCalledWith(serve, expect.any(Function))
    expect(logMock).toHaveBeenCalledWith('')
    expect(logMock).toHaveBeenCalledWith(expect.any(String))
    expect(logMock).toHaveBeenCalledWith('')
  })

  test('should display "Navigate to web browser" when LNG_LIVE_RELOAD is true', async () => {
    process.env.LNG_LIVE_RELOAD = 'true'
    const logMock = jest.spyOn(console, 'log')

    await dev()

    expect(logMock).toHaveBeenCalledWith('Navigate to web browser to see the changes')
  })

  test('should display "Reload your web browser" when LNG_LIVE_RELOAD is not true', async () => {
    process.env.LNG_LIVE_RELOAD = 'false'
    const logMock = jest.spyOn(console, 'log')

    await dev()

    expect(logMock).toHaveBeenCalledWith('Reload your web browser to see the changes')
  })
})
