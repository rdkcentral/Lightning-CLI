const path = require('path')

module.exports = packageName => {
  return new Promise(resolve => {
    try {
      const version = require(path.join(process.cwd(), 'node_modules', packageName, 'package.json'))
        .version

      resolve(version)
    } catch (e) {
      console.log(`Error occurred while getting package Version. Error is: ${e}`)
      resolve(false)
    }
  })
}
