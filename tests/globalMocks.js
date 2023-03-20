global.spinner = jest.mock('../src/helpers/spinner', () => {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    succeed: jest.fn(),
    fail: jest.fn(),
    warn: jest.fn(),
  }
})
