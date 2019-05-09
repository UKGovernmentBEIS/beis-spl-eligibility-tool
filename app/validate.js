const moment = require('moment')

function birthOrAdoption (req) {
  if (!req.body['birth-or-adoption']) {
    req.session.errors = { 'birth-or-adoption': 'Select either birth or adoption' }
  }
  return hasPassedValidation(req)
}

function caringWithPartner (req) {
  if (!req.body['caring-with-partner']) {
    req.session.errors = { 'caring-with-partner': { text: 'Select whether or not you are caring for the child with a partner' } }
  }
  return hasPassedValidation(req)
}

function startDate (req) {
  const {
    'start-date-year': year,
    'start-date-month': month,
    'start-date-day': day
  } = req.body

  const buildError = function (message) {
    return { text: message, href: '#start-date' }
  }

  const errorMessages = []
  const startDate = moment([year, month, day].join('-'), 'YYYY-MM-DD')

  if (startDate.invalidAt() === 2 || day.length === 0 || day.length > 2) {
    errorMessages.push(buildError('Day must be valid'))
  }

  if (startDate.invalidAt() === 1 || month.length === 0 || month.length > 2) {
    errorMessages.push(buildError('Month must be valid'))
  }

  if (startDate.invalidAt() === 0) {
    errorMessages.push(buildError('Year must be valid'))
  } else if (year.length !== 4) {
    errorMessages.push(buildError('Year must be in 4 digit form'))
  }

  const earliestPermitted = moment().subtract(1, 'year')
  const latestPermitted = moment().add(1, 'year')
  if (!startDate.isBetween(earliestPermitted, latestPermitted)) {
    errorMessages.push(buildError('start date must be within 1 year of today'))
  }

  if (errorMessages.length > 0) {
    req.session.errors['start-date'] = errorMessages
  }

  return hasPassedValidation(req)
}

const hasPassedValidation = function (req) {
  for (let error in req.session.errors) {
    if (req.session.errors.hasOwnProperty(error)) {
      return false
    }
  }
  return true
}

module.exports = {
  birthOrAdoption,
  caringWithPartner,
  startDate
}
