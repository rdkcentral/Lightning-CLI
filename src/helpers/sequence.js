module.exports = steps => {
  return steps.reduce((promise, method) => {
    return promise
      .then(function() {
        return method(...arguments)
      })
      .catch(Promise.reject)
  }, Promise.resolve(null))
}
