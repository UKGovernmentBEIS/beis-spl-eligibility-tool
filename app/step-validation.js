const paths = require('./paths')
const validate = require('./validate')

module.exports = function (req, res, next) {
  const earliestPathWithValidationErrors = getEarliestPathWithValidationErrors(paths.getPreviousPath(req.path), req)
  if (earliestPathWithValidationErrors) {
    res.redirect(earliestPathWithValidationErrors)
  } else {
    next()
  }
}

function getEarliestPathWithValidationErrors (path, req) {
  if (!path) {
    return null
  }
  const previousPath = paths.getPreviousPath(path)
  const earliestPathWithValidationErrors = getEarliestPathWithValidationErrors(previousPath, req)
  if (earliestPathWithValidationErrors) {
    return earliestPathWithValidationErrors
  }
  const pathName = paths.getName(path)
  const isValid = validate[pathName] ? validate[pathName](req) : true
  return isValid ? null : paths.getPath(pathName)
}
