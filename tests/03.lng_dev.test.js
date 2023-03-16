const puppeteer = require('puppeteer')

const devApp = require('../src/actions/dev')

jest.mock('../src/helpers/spinner')

const buildFolder = `${process.cwd()}/build`

describe('lng dev', () => {
  let originalExit = process.exit
  let browser
  let page

  beforeAll(async () => {
    process.exit = jest.fn()
    process.chdir(global.appConfig.appPath)
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()
    // Set screen size
    await page.setViewport({ width: 1920, height: 1080 })
  })

  afterAll(async () => {
    await browser.close()
    process.exit = originalExit
    process.chdir(global.originalCWD)
  })
  it('Should build app then run dev server with rollup and es5', async () => {
    //Don't run for now, devApp does not resolve
    // const devResult = await devApp(true)
    // console.info('======', devResult)
    // devResult.process.cancel()

    console.log(global.appConfig)

    expect('Development server does not return resolve').toBe(true)
  }, 10000)
  it.todo('Should build app then run dev server with rollup and es6')
  it.todo('Should build app then run dev server with esbuild and es5')
  it.todo('Should build app then run dev server with esbuild and es6')
})
