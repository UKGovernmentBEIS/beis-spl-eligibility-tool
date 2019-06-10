const delve = require('dlv')
const Day = require('../common/lib/day')
const {
  isYesOrNo,
  prettyList
} = require('./lib/validationUtils')

function birthOrAdoption (req) {
  const permittedValues = ['birth', 'adoption']
  if (!permittedValues.includes(req.session.data['birth-or-adoption'])) {
    addError(req, 'birth-or-adoption', 'Select either birth or adoption', '#birth-or-adoption-1')
    return false
  }
  return true
}

function caringWithPartner (req) {
  if (!isYesOrNo(req.session.data['caring-with-partner'])) {
    addError(req, 'caring-with-partner', 'Select whether or not you are caring for the child with a partner', '#caring-with-partner-1')
    return false
  }
  return true
}

function startDate (req) {
  req.session.errors = {}

  const date = {
    year: req.session.data['start-date-year'],
    month: req.session.data['start-date-month'],
    day: req.session.data['start-date-day']
  }

  if (Object.values(date).every(value => value === '')) {
    addStartDateError(req, 'Enter a date', ['day', 'month', 'year'])
    return false
  }

  if (Object.values(date).some(value => value === '')) {
    const errorParts = ['day', 'month', 'year'].filter(datePart => date[datePart] === '')
    addStartDateError(req, `Date must include a ${prettyList(errorParts)}`, errorParts)
    return false
  }

  const startDate = new Day(date.year, date.month, date.day)
  if (!startDate.isValid()) {
    const invalidIndex = startDate.invalidAt()
    const invalidPart = ['year', 'month', 'day'][invalidIndex]
    addStartDateError(req, 'Enter a valid date', [invalidPart])
    return false
  }

  const earliestPermitted = new Day().subtract(1, 'year')
  const latestPermitted = new Day().add(1, 'year')
  if (!startDate.isBetween(earliestPermitted, latestPermitted)) {
    addStartDateError(req, 'Date must be within one year of today', ['day', 'month', 'year'])
    return false
  }
  return true
}

function addStartDateError (req, message, dateParts) {
  const href = `#start-date-${dateParts[0]}`
  addError(req, 'start-date', message, href, { dateParts })
}

function employmentStatus (req, parentFromUrl) {
  const parent = parentFromUrl === 'partner' ? 'secondary' : 'primary'
  const employmentStatus = delve(req.session.data, [parent, 'employment-status'])
  const permittedValues = ['employee', 'worker', 'self-employed', 'unemployed']
  if (!permittedValues.includes(employmentStatus)) {
    addError(req, 'employment-status', 'Select your employment status', '#employment-status-1')
    return false
  }
  return true
}

function workAndPay (req, parentFromUrl) {
  const parent = parentFromUrl === 'partner' ? 'secondary' : 'primary'
  return validateParentYesNoFields(req, parent, {
    'work-start': 'Select whether or not you started your job before the date given',
    'continuous-work': 'Select whether or not your work has been continuous during the period given',
    'pay-threshold': 'Select whether or not you meet the pay threshold'
  })
}

function otherParentWorkAndPay (req, parentFromUrl) {
  const parent = parentFromUrl === 'partner' ? 'secondary' : 'primary'
  return validateParentYesNoFields(req, parent, {
    'other-parent-work': 'Select whether or not your partner meets the work threshold',
    'other-parent-pay': 'Select whether or not your partner meets the pay threshold'
  })
}

function validateParentYesNoFields (req, parent, fieldErrorMessages) {
  let isValid = true
  for (const [field, message] of Object.entries(fieldErrorMessages)) {
    const value = delve(req.session.data, [parent, field])
    if (!isYesOrNo(value)) {
      addError(req, field, message, `#${field}-1`)
      isValid = false
    }
  }
  return isValid
}

function addError (req, field, message, href, errorProps) {
  if (!req.session.errors) {
    req.session.errors = {}
  }
  req.session.errors[field] = { text: message, href: href, ...errorProps }
}

module.exports = {
  birthOrAdoption,
  caringWithPartner,
  startDate,
  employmentStatus,
  workAndPay,
  otherParentWorkAndPay
}
