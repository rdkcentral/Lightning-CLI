const fs = require('fs-extra')
const { addMsg } = require('jest-html-reporters/helper')

const buildApp = require('../src/actions/build')
const buildHelpers = require('../src/helpers/build')
const lngDist = require('../src/actions/dist')
const serveApp = require('../src/actions/serve')
const dotenv = require('dotenv')

require('../src/helpers/spinner')

jest.mock('opener', () => jest.fn())
jest.mock('commander', () => {
  return {
    action: jest.fn().mockReturnThis(),
    command: jest.fn().mockReturnThis(),
    description: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    option: jest.fn().mockReturnThis(),
    parse: jest.fn(),
    usage: jest.fn().mockReturnThis(),
    version: jest.fn().mockReturnThis(),
  }
})

describe('Environment Variables', () => {
  const originalEnv = process.env
  let buildFolder

  beforeEach(() => {
    jest.resetModules()

    fs.removeSync('.env')
    fs.createFileSync('.env')
    process.env = { ...originalEnv }
  })
  afterEach(() => {
    process.env = originalEnv
  })
  beforeAll(async () => {
    process.chdir(global.appConfig.appPath)
    buildFolder = `${process.cwd()}/build`
  })

  afterAll(() => {
    process.chdir(global.originalCWD)
  })

  it('Should open up the build in the browser if LNG_SERVE_OPEN is true in .env', async () => {
    const opener = require('opener')
    const preventstout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
    global.setEnvironmentValue('LNG_SERVE_OPEN', false)
    //Load the .env values
    dotenv.config({ override: true })

    const devServer = await serveApp()

    await addMsg({ message: 'Cannot mock from a binary -> http-server' })
    //Cannot mock from a binary -> http-server
    expect(opener).toHaveBeenCalledTimes(0)

    devServer.process.cancel()
    preventstout.mockRestore()
  })

  it('Should start a http-server on port defined in LNG_SERVE_PORT in .env', async () => {
    const preventstout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
    global.setEnvironmentValue('LNG_SERVE_OPEN', false)
    global.setEnvironmentValue('LNG_SERVE_PORT', 9000)
    //Load the .env values
    dotenv.config({ override: true })

    const devServer = await serveApp()

    expect(devServer.config.url).toContain('9000')

    devServer.process.cancel()
    preventstout.mockRestore()
  })

  it('Should start a http-server on port defined in LNG_SERVE_PORT in .env', async () => {
    const preventstout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
    global.setEnvironmentValue('LNG_SERVE_OPEN', false)
    global.setEnvironmentValue('LNG_SERVE_PORT', 9000)
    //Load the .env values
    dotenv.config({ override: true })

    const devServer = await serveApp()

    expect(devServer.config.url).toContain('9000')

    devServer.process.cancel()
    preventstout.mockRestore()
  })

  it('Should build a app with sourcemaps defined in LNG_BUILD_SOURCEMAP in .env', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)
    const preventstout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
    global.setEnvironmentValue('LNG_BUILD_SOURCEMAP', true)
    global.setEnvironmentValue('LNG_BUNDLER', 'rollup')

    //Load the .env values
    dotenv.config({ override: true })

    const buildResult = await buildApp(true)
    await addMsg({ message: JSON.stringify(buildResult, null, 2) })

    expect(fs.existsSync(`${buildFolder}/appBundle.js.map`)).toBe(true)

    preventstout.mockRestore()
  })

  it('Should build a app without sourcemaps defined in LNG_BUILD_SOURCEMAP in .env', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)
    const preventstout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
    global.setEnvironmentValue('LNG_BUILD_SOURCEMAP', false)
    global.setEnvironmentValue('LNG_BUNDLER', 'rollup')

    //Load the .env values
    dotenv.config({ override: true })

    const buildResult = await buildApp(true)
    await addMsg({ message: JSON.stringify(buildResult, null, 2) })

    expect(fs.existsSync(`${buildFolder}/appBundle.js.map`)).toBe(false)
    const appBundleJS = fs.readFileSync(`${buildFolder}/appBundle.js`, 'utf8')
    expect(appBundleJS).not.toContain('sourceMappingURL=data:application/json;charset=utf-8;base64')

    preventstout.mockRestore()
  })

  it('Should build a app with inline sourcemaps defined in LNG_BUILD_SOURCEMAP in .env', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)
    const preventstout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
    global.setEnvironmentValue('LNG_BUILD_SOURCEMAP', 'inline')
    global.setEnvironmentValue('LNG_BUNDLER', 'rollup')

    //Load the .env values
    dotenv.config({ override: true })

    const buildResult = await buildApp(true)
    await addMsg({ message: JSON.stringify(buildResult, null, 2) })

    expect(fs.existsSync(`${buildFolder}/appBundle.js.map`)).toBe(false)
    const appBundleJS = fs.readFileSync(`${buildFolder}/appBundle.js`, 'utf8')
    expect(appBundleJS).toContain('sourceMappingURL=data:application/json;charset=utf-8;base64')

    preventstout.mockRestore()
  })

  it('Should build a app in directory defined in LNG_BUILD_FOLDER in .env', async () => {
    let testbuildFolder = `${process.cwd()}/testbuild`
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/testbuild`)
    // const preventstout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
    global.setEnvironmentValue('LNG_BUILD_FOLDER', 'testbuild')
    global.setEnvironmentValue('LNG_BUNDLER', 'rollup')

    //Load the .env values
    dotenv.config({ override: true })

    const buildResult = await buildApp(true)
    await addMsg({ message: JSON.stringify(buildResult, null, 2) })

    //Should have sourcemap file
    expect(fs.existsSync(`${testbuildFolder}/appBundle.js.map`)).toBe(true)

    //Should not inline the sourcemap
    const appBundleJS = fs.readFileSync(`${testbuildFolder}/appBundle.js`, 'utf8')
    expect(appBundleJS).not.toContain('sourceMappingURL=data:application/json;charset=utf-8;base64')

    // preventstout.mockRestore()
  })
  it('Should create a distributable version in directory defined in LNG_DIST_FOLDER in .env', async () => {
    let testdistFolder = `${process.cwd()}/testdist`
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/testdist`)
    const preventstout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
    global.setEnvironmentValue('LNG_DIST_FOLDER', 'testdist')
    global.setEnvironmentValue('LNG_BUNDLER', 'rollup')

    //Load the .env values
    dotenv.config({ override: true })

    const distResult = await lngDist({
      types: ['es6'],
      isWatchEnabled: false,
    })
    await addMsg({ message: JSON.stringify(distResult, null, 2) })

    //Check if dist folder exists
    expect(fs.pathExistsSync(testdistFolder)).toBe(true)
    expect(fs.pathExistsSync(`${testdistFolder}/es6`)).toBe(true)

    preventstout.mockRestore()
  })

  it('Should override .env file with process.env when variable existing on both', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/testdist`)
    const preventstout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})

    // First set through setEnvironmentValue which writes the .env file then set on process environment
    global.setEnvironmentValue('LNG_DIST_FOLDER', 'test1dist')
    process.env.LNG_DIST_FOLDER = 'testdist'

    //Load the .env values don't override which is default used by lightning-cli
    dotenv.config()

    const distResult = await lngDist({
      types: ['es6'],
      isWatchEnabled: false,
    })
    await addMsg({ message: JSON.stringify(distResult, null, 2) })

    // Check if dist folder exists
    expect(fs.pathExistsSync(`${process.cwd()}/testdist`)).toBe(true)
    expect(fs.pathExistsSync(`${process.cwd()}/test1dist`)).toBe(false)
    expect(fs.pathExistsSync(`${process.cwd()}/testdist/es6`)).toBe(true)

    preventstout.mockRestore()
  })
})
