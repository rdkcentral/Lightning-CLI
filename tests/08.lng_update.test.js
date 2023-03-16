const { addMsg } = require('jest-html-reporters/helper')
const upToDate = require('../src/helpers/uptodate')

jest.mock('../src/helpers/spinner')

describe('lng update', () => {
  let originalExit = process.exit

  beforeAll(async () => {
    process.chdir(global.appConfig.appPath)
    process.exit = jest.fn()
  })

  afterAll(async () => {
    process.exit = originalExit
    process.chdir(global.originalCWD)
  })
  it('Update tests', async () => {
    const result = await upToDate()
    await addMsg({ message: JSON.stringify(result, null, 2) })

    expect(result).not.toContain('git folder exists')
  })
})
