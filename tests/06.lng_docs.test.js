const puppeteer = require('puppeteer')
const { addAttach } = require("jest-html-reporters/helper")
const { toMatchImageSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImageSnapshot })

const lngDocs = require('../src/actions/docs')

jest.mock('../src/helpers/spinner')

describe('lng docs', () => {
  let originalExit = process.exit
  let browser
  let page

  beforeAll(async () => {
    process.exit = jest.fn()
    process.chdir(global.appConfig.appPath)
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

  it('Should serve the documentation for Lightning-Cli', async () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {})
    const docServer = await lngDocs()

    expect(docServer.config.url).toMatch(/https?:\/\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}(?=\s*$)/)
    await page.goto(docServer.config.url, {
      waitUntil: 'networkidle0'
    })

    const landingPageImage = await page.screenshot()
    await addAttach({
      attach: landingPageImage,
      description: 'Documentation',
    })

    // Type into search box
    await page.type('input[placeholder="Type to search"]', 'changelog')

    // Wait and click on first result
    const searchResultSelector = '.matching-post'
    await page.waitForSelector(searchResultSelector)
    await page.click(searchResultSelector)

    const changelogPageImage = await page.screenshot()
    await addAttach({
      attach: changelogPageImage,
      description: 'Documentation Changelog',
    })
    docServer.process.cancel()
  }, 10000)
})
