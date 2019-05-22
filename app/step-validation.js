const paths = require('./paths')
const validate = require('./validate')

module.exports = function (req, res, next) {
  const stepIndex = paths.getIndex(req.url)
  if (stepIndex === 0) { return next() }
  const indexOfEarliestErrorPage = validateHistory(req, stepIndex - 1)
  console.log(indexOfEarliestErrorPage)
  return indexOfEarliestErrorPage > -1 ? res.redirect(paths.getPath(indexOfEarliestErrorPage)) : next()
}

function validateHistory (req, index) {
  let errorAtIndex
  console.log('index')
  console.log(index)
  if (index > 0) {
    errorAtIndex = validateHistory(req, index - 1)
    console.log('in if')
    console.log(errorAtIndex)
    if (errorAtIndex > -1) { return errorAtIndex }
  }
  console.log('route')
  console.log(paths.getName(index))

  const stepName = paths.getName(index)
  const isStepValid = stepHasValidator(stepName) ? validate[stepName](req) : true
  return isStepValid ? -1 : index
}

function stepHasValidator (stepName) {
  return !!validate[stepName]
}
