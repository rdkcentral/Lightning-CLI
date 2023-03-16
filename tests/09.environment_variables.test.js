describe('Environment Variables', () => {
  afterAll(() => {
    //Change back to Lightning-Cli path after all tests are done. Needs to be done in last test
    //Because otherwise the html-reporter is in the wrong path
    process.chdir(global.originalCWD)
  })
  it.todo('Environment Variables tests')
})
