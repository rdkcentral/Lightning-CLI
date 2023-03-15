afterAll(() => {
  //Change back to Lightning-Cli path after all tests are done.
  process.chdir(globalThis.originalCWD)
});

describe('Environment Variables', () => {
  it.todo('Environment Variables tests')
});
