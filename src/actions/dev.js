const watch = require('./watch')
const serve = require('./serve')
module.exports = () => {
  watch(serve, () => {
    console.log('todo: reload the sever upon file changes')
  })
}
