describe('lng upload', () => {
  it('Should give a warning that the command has moved', () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {})
    global.cli('upload')

    expect(log).toHaveBeenCalledWith(
      '\x1B[33mThe `lng upload` command is no longer part of the Lightning-CLI, but has moved to a separate package.\x1B[39m'
    )
  })
})
