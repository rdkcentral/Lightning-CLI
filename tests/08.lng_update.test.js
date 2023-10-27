const { addMsg } = require('jest-html-reporters/helper')
const upToDate = require('../src/helpers/uptodate')
const createApp = require('../src/actions/create')
const inquirer = require('inquirer')

jest.mock('../src/helpers/spinner')
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}))
describe('lng update', () => {
  let originalExit = process.exit

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
    process.exit = jest.fn()
  }, 30000)

  afterAll(async () => {
    process.exit = originalExit
    process.chdir(global.originalCWD)
  })
  it('Update tests', async () => {
    const result = await upToDate()
    await addMsg({ message: JSON.stringify(result, null, 2) })

    // expect(result).not.toContain('git folder exists')
    expect(result).toContain('git folder exists')
  })
})
