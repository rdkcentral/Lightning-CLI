const fs = require('fs-extra')
const puppeteer = require('puppeteer')
const { addAttach } = require('jest-html-reporters/helper')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImageSnapshot })
const createApp = require('../src/actions/create')

const lngDocs = require('../src/actions/docs')

const inquirer = require('inquirer')
jest.mock('../src/helpers/spinner')
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}))

describe('lng docs', () => {
  let originalExit = process.exit
  let browser
  let page

  beforeAll(async () => {
    process.exit = jest.fn()
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
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()
    // Set screen size
    await page.setViewport({ width: 1920, height: 1080 })
  }, 30000)

  afterAll(async () => {
    await browser.close()
    process.exit = originalExit
    fs.removeSync(`${global.appConfig.appPath}`)
    process.chdir(global.originalCWD)
  })

  it('Should serve the documentation for Lightning-Cli', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    const docServer = await lngDocs()

    expect(docServer.config.url).toMatch(
      /https?:\/\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}(?=\s*$)/
    )
    await page.goto(docServer.config.url, {
      waitUntil: 'networkidle0',
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
    await docServer.process.cancel()
  }, 10000)
})
