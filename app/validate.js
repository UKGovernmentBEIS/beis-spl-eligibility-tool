const moment = require('moment')
const delve = require('dlv')

function birthOrAdoption (req) {
  if (req.body['birth-or-adoption'] === undefined) {
    req.session.errors = { 'birth-or-adoption': 'Select either birth or adoption' }
  }
  return hasPassedValidation(req)
}

function caringWithPartner (req) {
  if (req.body['caring-with-partner'] === undefined) {
    req.session.errors = { 'caring-with-partner': 'Select whether or not you are caring for the child with a partner' }
  }
  return hasPassedValidation(req)
}

function startDate (req) {
  const {
    'start-date-year': year,
    'start-date-month': month,
    'start-date-day': day
  } = req.body

  const errorMessages = []
  const startDate = moment([year, month, day].join('-'), 'YYYY-MM-DD')

  if (startDate.invalidAt() === 2 || day.length === 0 || day.length > 2) {
    errorMessages.push(buildError('Day must be valid', '#start-date'))
  }

  if (startDate.invalidAt() === 1 || month.length === 0 || month.length > 2) {
    errorMessages.push(buildError('Month must be valid', '#start-date'))
  }

  if (startDate.invalidAt() === 0) {
    errorMessages.push(buildError('Year must be valid', '#start-date'))
  } else if (year.length !== 4) {
    errorMessages.push(buildError('Year must be in 4 digit form', '#start-date'))
  }

  const earliestPermitted = moment().subtract(1, 'year')
  const latestPermitted = moment().add(1, 'year')
  if (!startDate.isBetween(earliestPermitted, latestPermitted)) {
    errorMessages.push(buildError('Start date must be within 1 year of today', '#start-date'))
  }

  if (errorMessages.length > 0) {
    req.session.errors['start-date'] = errorMessages
  }

  return hasPassedValidation(req)
}

function employmentStatus (req) {
  const parent = req.params['current'] === 'partner' ? 'secondary' : 'primary'
  if (delve(req.body, [parent, 'employment-status']) === undefined) {
    req.session.errors['employment-status'] = buildError('Please indicate your employment status', '#employment-status-1')
  }
  return hasPassedValidation(req)
}

function workAndPay (req) {
  const parent = req.params['current'] === 'partner' ? 'secondary' : 'primary'
  if (delve(req.body, [parent, 'work-start']) === undefined) {
    req.session.errors['work-start'] = buildError('Please indicate when you started your job', '#work-start-1')
  }
  if (delve(req.body, [parent, 'continuous-work']) === undefined) {
    req.session.errors['continuous-work'] = buildError('Please whether your work has been continuous during this time', '#continuous-work-1')
  }
  if (delve(req.body, [parent, 'pay-threshold']) === undefined) {
    req.session.errors['pay-threshold'] = buildError('Please indicate whether you meet this pay threshold', '#pay-threshold-1')
  }
  return hasPassedValidation(req)
}

function hasPassedValidation (req) {
  for (let error in req.session.errors) {
    if (req.session.errors.hasOwnProperty(error)) {
      return false
    }
  }
  return true
}

function buildError (message, href) {
  return { text: message, href: href }
}

module.exports = {
  birthOrAdoption,
  caringWithPartner,
  startDate,
  employmentStatus,
  workAndPay
}
