global.spinner = jest.mock('./../../src/helpers/spinner', () => {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    succeed: jest.fn(),
    fail: jest.fn(),
    warn: jest.fn(),
  }
})
global.cli = (command, options) => {
  const originalArgv = process.argv.slice()
  process.argv.length = 2
  process.argv[2] = command || 'help'

  if (Array.isArray(options))
    options.forEach(element => {
      process.argv.push(element)
    })
  require('../../bin/index')
  process.argv = originalArgv
}
