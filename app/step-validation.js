const paths = require('./paths')
const Workflow = require('./lib/workflow')
const workflow = new Workflow(paths)
const validate = require('./validate')

module.exports = function (req, res, next) {
  const { path, parent } = workflow.getPartsOfPath(req.path)
  const earliestPathWithValidationErrors = getEarliestPathWithValidationErrors(workflow.getPreviousPath(path), req)
  if (earliestPathWithValidationErrors) {
    const redirectPath = workflow.buildRedirectPath(earliestPathWithValidationErrors, { parent })
    res.redirect(redirectPath)
  } else {
    next()
  }
}

function getEarliestPathWithValidationErrors (path, req) {
  if (!path) {
    return null
  }
  const previousPath = workflow.getPreviousPath(path)
  const earliestPathWithValidationErrors = getEarliestPathWithValidationErrors(previousPath, req)
  if (earliestPathWithValidationErrors) {
    return earliestPathWithValidationErrors
  }
  const pathName = paths.getName(path)
  const isValid = validate[pathName] ? validate[pathName](req) : true
  return isValid ? null : paths.getPath(pathName)
}
