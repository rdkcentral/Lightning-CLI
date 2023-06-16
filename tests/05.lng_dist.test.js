const fs = require('fs-extra')
const { addMsg } = require('jest-html-reporters/helper')
const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImageSnapshot })

const lngDist = require('../src/actions/dist')
jest.mock('../src/helpers/spinner')
describe('lng dist', () => {
  let browser, page, distFolder
  let originalExit = process.exit

  beforeAll(async () => {
    process.exit = jest.fn()
    process.chdir(global.appConfig.appPath)
    distFolder = `${process.cwd()}/dist`
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()
    // Set screen size
    await page.setViewport({ width: 1920, height: 1080 })
    global.changeShowVersion(false)
  })

  afterAll(async () => {
    await browser.close()
    process.exit = originalExit
    process.chdir(global.originalCWD)
  })

  it('Should create a distributable version with rollup and es5', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/dist`)

    process.env.LNG_BUNDLER = 'rollup'
    const distResult = await lngDist({
      types: ['es5'],
      isWatchEnabled: false,
    })
    await addMsg({ message: JSON.stringify(distResult, null, 2) })

    //Check if dist folder exists
    expect(fs.pathExistsSync(distFolder)).toBe(true)
    expect(fs.pathExistsSync(`${distFolder}/es5`)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${distFolder}/es5/index.html`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/appBundle.es5.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/lightning.es5.min.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/polyfills.js`)).toBe(true)

    //TODO Cors prevents image loads
    // await page.goto(`file://${distFolder}/es5/index.html`, {
    //   waitUntil: 'networkidle0'
    // })

    // const image = await page.screenshot()
    // expect(image).toMatchImageSnapshot()

    // await addAttach({
    //   attach: image,
    //   description: 'Default App',
    // })
  }, 10000)

  it('Should create a distributable version with rollup and es6', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/dist`)
    process.env.LNG_BUNDLER = 'rollup'
    const distResult = await lngDist({
      types: ['es6'],
      isWatchEnabled: false,
    })
    await addMsg({ message: JSON.stringify(distResult, null, 2) })

    //Check if dist folder exists
    expect(fs.pathExistsSync(distFolder)).toBe(true)
    expect(fs.pathExistsSync(`${distFolder}/es6`)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${distFolder}/es6/index.html`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es6/js/appBundle.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es6/js/lightning.min.js`)).toBe(true)
  }, 10000)

  it('Should create a distributable version with rollup and es5 and es6', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/dist`)
    process.env.LNG_BUNDLER = 'rollup'
    const distResult = await lngDist({
      types: ['es5', 'es6'],
      isWatchEnabled: false,
    })
    await addMsg({ message: JSON.stringify(distResult, null, 2) })

    //es5
    //Check if dist folder exists
    expect(fs.pathExistsSync(distFolder)).toBe(true)
    expect(fs.pathExistsSync(`${distFolder}/es5`)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${distFolder}/es5/index.html`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/appBundle.es5.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/lightning.es5.min.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/polyfills.js`)).toBe(true)

    //es6
    //Check if dist folder exists
    expect(fs.pathExistsSync(distFolder)).toBe(true)
    expect(fs.pathExistsSync(`${distFolder}/es6`)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${distFolder}/es6/index.html`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es6/js/appBundle.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es6/js/lightning.min.js`)).toBe(true)
  }, 10000)

  it('Should create a distributable version with esbuild and es5', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/dist`)
    process.env.LNG_BUNDLER = 'esbuild'
    const distResult = await lngDist({
      types: ['es5'],
      isWatchEnabled: false,
    })
    await addMsg({ message: JSON.stringify(distResult, null, 2) })

    //Check if dist folder exists
    expect(fs.pathExistsSync(distFolder)).toBe(true)
    expect(fs.pathExistsSync(`${distFolder}/es5`)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${distFolder}/es5/index.html`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/appBundle.es5.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/lightning.es5.min.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/polyfills.js`)).toBe(true)
  }, 10000)

  it('Should create a distributable version with esbuild and es6', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/dist`)
    process.env.LNG_BUNDLER = 'esbuild'
    const distResult = await lngDist({
      types: ['es6'],
      isWatchEnabled: false,
    })
    await addMsg({ message: JSON.stringify(distResult, null, 2) })

    //Check if dist folder exists
    expect(fs.pathExistsSync(distFolder)).toBe(true)
    expect(fs.pathExistsSync(`${distFolder}/es6`)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${distFolder}/es6/index.html`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es6/js/appBundle.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es6/js/lightning.min.js`)).toBe(true)
  }, 10000)

  it('Should create a distributable version with esbuild and es5 and es6', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/dist`)
    process.env.LNG_BUNDLER = 'esbuild'
    const distResult = await lngDist({
      types: ['es5', 'es6'],
      isWatchEnabled: false,
    })
    await addMsg({ message: JSON.stringify(distResult, null, 2) })

    //es5
    //Check if dist folder exists
    expect(fs.pathExistsSync(distFolder)).toBe(true)
    expect(fs.pathExistsSync(`${distFolder}/es5`)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${distFolder}/es5/index.html`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/appBundle.es5.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/lightning.es5.min.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es5/js/polyfills.js`)).toBe(true)
    //es6
    //Check if dist folder exists
    expect(fs.pathExistsSync(distFolder)).toBe(true)
    expect(fs.pathExistsSync(`${distFolder}/es6`)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${distFolder}/es6/index.html`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es6/js/appBundle.js`)).toBe(true)
    expect(fs.existsSync(`${distFolder}/es6/js/lightning.min.js`)).toBe(true)
  }, 10000)
})
