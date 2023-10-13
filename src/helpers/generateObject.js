// Regular expressions to validate Windows file paths and URLs
const windowsFilePathRegex = /^(?:[a-zA-Z]:)?(\\[^\\:*?"<>|]*)*\\?$/
const urlRegex = /^(https?|ftp?|localhost):(\/\/?|\d{4}).*$/

/**
 * This function generates an object from an array of strings in the format "key=value"
 */
const generateObject = arr => {
  return arr.reduce((generatedObject, element) => {
    const [key, val] = element.split('=')

    if (urlRegex.test(val) || windowsFilePathRegex.test(val)) {
      generatedObject[key] = val
    } else if (element.includes('[') && element.includes(']')) {
      generatedObject[key] = val.split(',').map(item => item.replace(/\[|\]/g, ''))
    } else if (element.includes(':')) {
      const [objKey, objVal] = element.split(':')
      generatedObject[objKey] = {
        ...generatedObject[objKey],
        [objVal.split('=')[0]]: objVal.split('=')[1],
      }
    } else if (element.includes('=')) {
      generatedObject[key] = isNaN(val)
        ? val === 'true'
          ? true
          : val === 'false'
          ? false
          : val
        : parseFloat(val)
    } else {
      generatedObject[key] = true
    }
    return generatedObject
  }, {})
}

module.exports = generateObject
