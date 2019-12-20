const watch = require('./watch')
const serve = require('./serve')
module.exports = () => {
  watch(serve, () => {
    // fixme: reload webbrowser automatically
    console.log('')
    console.log('Reload your webbrowser to see the changes')
    console.log('')
  })
}
