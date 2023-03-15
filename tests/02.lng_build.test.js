const fs = require('fs-extra')
const dotenv = require('dotenv')

const buildApp = require('../src/actions/build')
const buildHelpers = require('../src/helpers/build')

jest.mock('is-online', () => jest.fn())

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}))
jest.mock('../src/helpers/spinner')

describe('lng build', () => {
  let originalExit = process.exit
  let buildFolder = null

  beforeAll(async () => {
    process.chdir(global.appConfig.appPath)
    buildFolder = `${process.cwd()}/build`
    process.exit = jest.fn()
  })

  afterAll(async () => {
    process.exit = originalExit
    process.chdir(global.originalCWD)
  })
  it('settings.json should have the correct data structure', async () => {
    const settings = await buildHelpers.readSettings()

    expect(settings).toEqual({
      // Define the expected structure of the JSON file
      appSettings: expect.objectContaining({
        stage: expect.objectContaining({
          clearColor: expect.any(String),
          useImageWorker: expect.any(Boolean)
        }),
        debug: expect.any(Boolean)
      }),
      platformSettings: expect.objectContaining({
        path: expect.any(String),
        log: expect.any(Boolean),
        showVersion: expect.any(Boolean)
      })
    })
  })

  it('settings.json should have the correct data', async () => {
    const settings = await buildHelpers.readSettings()
    expect(settings.platformSettings.path).toBe('./static')
  })

  //Not very usefull error message when npm install is not run
  it('Should build app with esbuild and es5', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)

    const log = jest.spyOn(console, "log").mockImplementation(() => {})
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {})
    // global.setEnvironmentValue('LNG_BUNDLER', 'esbuild')
    process.env.LNG_BUNDLER = 'esbuild'
    global.changeEsEnv('es5')

    const buildResult = await buildApp(true)

    //TODO inconsistent return value -> es5 returns object with metadata.json content, es6 returns Boolean false

    //Check if build folder exists
    expect(fs.pathExistsSync(buildFolder)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/startApp.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/index.html`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js.map`)).toBe(true)
  })

  it('Should build app with esbuild and es6', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)
    const log = jest.spyOn(console, "log").mockImplementation(() => {})
    // global.setEnvironmentValue('LNG_BUNDLER', 'esbuild')
    process.env.LNG_BUNDLER = 'esbuild'
    global.changeEsEnv('es6')

    const buildResult = await buildApp(true)

    //TODO inconsistent return value -> es5 returns object with metadata.json content, es6 returns Boolean false

    //Check if build folder exists
    expect(fs.pathExistsSync(buildFolder)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/startApp.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/index.html`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js.map`)).toBe(true)
  })

  it('should build app with rollup and es5', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)
    const log = jest.spyOn(console, "log").mockImplementation(() => {})
    // global.setEnvironmentValue('LNG_BUNDLER', 'rollup')
    process.env.LNG_BUNDLER = 'rollup'
    global.changeEsEnv('es5')

    const buildResult = await buildApp(true)

    //TODO inconsistent return value -> es5 returns object with metadata.json content, es6 returns Boolean false

    //Check if build folder exists
    expect(fs.pathExistsSync(buildFolder)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/startApp.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/index.html`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js.map`)).toBe(true)
  }, 10000)

  it('Should build app with rollup and es6', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)
    const log = jest.spyOn(console, "log").mockImplementation(() => {})
    // global.setEnvironmentValue('LNG_BUNDLER', 'rollup')
    process.env.LNG_BUNDLER = 'rollup'
    global.changeEsEnv('es6')

    const buildResult = await buildApp(true)

    //TODO inconsistent return value -> es5 returns object with metadata.json content, es6 returns Boolean false

    //Check if build folder exists
    expect(fs.pathExistsSync(buildFolder)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/startApp.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/index.html`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.js.map`)).toBe(true)
  })
})
