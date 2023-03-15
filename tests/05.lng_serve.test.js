const fs = require('fs-extra')
const { addAttach } = require("jest-html-reporters/helper")
const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImageSnapshot })

const buildApp = require('../src/actions/build')
const serveApp = require('../src/actions/serve')

jest.mock('../src/helpers/spinner')

describe('lng serve', () => {
  let originalExit = process.exit
  let browser
  let page

  beforeAll(async () => {
    process.exit = jest.fn()
    process.chdir(global.appConfig.appPath)
    buildFolder = `${process.cwd()}/build`
    browser = await puppeteer.launch({headless: true})
    page = await browser.newPage()
    // Set screen size
    await page.setViewport({width: 1920, height: 1080})
  })

  afterAll(async () => {
    await browser.close()
    process.exit = originalExit;
    process.chdir(global.originalCWD)
  })

  it('Should build app with rollup and es6 without version', async () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {})

    process.env.LNG_BUNDLER = 'rollup'
    global.changeEsEnv('es6')
    global.changeShowVersion(false)

    const buildResult = await buildApp(true)

    //TODO inconsistent return value -> es5 returns object with metadata.json content, es6 returns Boolean false

    //Check if build folder exists
    expect(fs.pathExistsSync(buildFolder)).toBe(true);
    //Check for files and directories
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true);
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true);
    expect(fs.existsSync(`${buildFolder}/metadata.json`)).toBe(true);
    expect(fs.existsSync(`${buildFolder}/startApp.js`)).toBe(true);
    expect(fs.existsSync(`${buildFolder}/index.html`)).toBe(true);
    expect(fs.existsSync(`${buildFolder}/appBundle.js`)).toBe(true);
    expect(fs.existsSync(`${buildFolder}/appBundle.js.map`)).toBe(true);
  })

  it('Start a local webserver and run a built Lightning App in a web browser', async () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {})
    const devServer = await serveApp()

    expect(devServer.config.url).toMatch(/https?:\/\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}(?=\s*$)/)
    await page.goto(devServer.config.url, {
      waitUntil: 'networkidle0'
    })
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot()

    await addAttach({
      attach: image,
      description: 'Default App',
    })

    //Stop the http server
    devServer.process.cancel()
  }, 10000)
});
