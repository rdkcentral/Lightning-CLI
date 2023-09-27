// Regular expressions to validate Windows file paths and URLs
const windowsFilePathRegex = /^(?:[a-zA-Z]:)?(\\[^\\:*?"<>|]*)*\\?$/
const urlRegex = /^(https?|ftp?|localhost):(\/\/?|\d{4}).*$/

const generateObject = arr => {
  const generatedObject = {}

  arr.forEach(element => {
    const [key, val] = element.split('=')

    if (urlRegex.test(val) || windowsFilePathRegex.test(val)) {
      generatedObject[key] = val
    } else if (element.includes('[') && element.includes(']')) {
      // Check if the element contains square brackets '[' and ']'
      // If yes, split the value by ',' and remove any '[' or ']' characters, then assign it to the generated object as an array
      generatedObject[key] = val.split(',').map(item => item.replace(/\[|\]/g, ''))
    } else if (element.includes(':')) {
      const [objKey, objVal] = element.split(':')
      // Create or update the object in the generated object and add the key-value pair
      generatedObject[objKey] = {
        ...generatedObject[objKey],
        [objVal.split('=')[0]]: objVal.split('=')[1],
      }
    } else if (element.includes('=')) {
      // Check if the value is a number or a boolean, and convert it accordingly
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
  })
  return generatedObject
}

module.exports = generateObject
