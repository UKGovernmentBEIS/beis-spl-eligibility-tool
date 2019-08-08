const delve = require('dlv')
const Day = require('../common/lib/day')
const {
  addError,
  isYesOrNo,
  prettyList,
  validateParentYesNoFields
} = require('./lib/validationUtils')
const skip = require('./skip')

function natureOfParenthood (req) {
  const permittedValues = ['birth', 'adoption', 'surrogacy']
  if (!permittedValues.includes(req.session.data['nature-of-parenthood'])) {
    addError(req, 'nature-of-parenthood', 'Select either birth, adoption or surrogacy', '#nature-of-parenthood-1')
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
  const date = {
    year: req.session.data['start-date-year'],
    month: req.session.data['start-date-month'],
    day: req.session.data['start-date-day']
  }

  const allParts = ['day', 'month', 'year']

  const emptyParts = allParts.filter(datePart => date[datePart] === '')
  if (emptyParts.length > 0) {
    addStartDateError(req, `Enter a valid ${prettyList(emptyParts)}`, emptyParts)
    return false
  }

  const startDate = new Day(date.year, date.month, date.day)
  if (!startDate.isValid()) {
    const invalidIndex = startDate.invalidAt()
    const invalidPart = ['year', 'month', 'day'][invalidIndex]
    if (invalidPart) {
      addStartDateError(req, `Enter a valid ${invalidPart}`, [invalidPart])
    } else {
      addStartDateError(req, 'Enter a valid date', allParts)
    }
    return false
  }

  const earliestPermitted = new Day().subtract(1, 'year')
  const latestPermitted = new Day().add(1, 'year')
  if (!startDate.isBetween(earliestPermitted, latestPermitted)) {
    addStartDateError(req, 'Enter a date within one year of today', allParts)
    return false
  }

  return true
}

function addStartDateError (req, message, dateParts) {
  const href = `#start-date-${dateParts[0]}`
  addError(req, 'start-date', message, href, { dateParts })
}

function whichParent (req) {
  const permittedValues = ['primary', 'secondary', 'both']
  if (!permittedValues.includes(req.session.data['which-parent'])) {
    addError(req, 'which-parent', 'Select whose eligibility you would like to check', '#which-parent-1')
    return false
  }
  return true
}

function employmentStatus (req, parent) {
  if (skip.employmentStatus(req.session.data, parent)) {
    return true
  }

  const employmentStatus = delve(req.session.data, [parent, 'employment-status'])
  const permittedValues = ['employee', 'worker', 'self-employed', 'unemployed']
  if (!permittedValues.includes(employmentStatus)) {
    addError(req, 'employment-status', 'Select your employment status', '#employment-status-1')
    return false
  }
  return true
}

function workAndPay (req, parent) {
  if (skip.workAndPay(req.session.data, parent)) {
    return true
  }

  return validateParentYesNoFields(req, parent, {
    'work-start': 'Select whether or not you started your job before the date given',
    'continuous-work': 'Select whether or not your work has been continuous during the period given',
    'pay-threshold': 'Select whether or not you meet the pay threshold'
  })
}

function otherParentWorkAndPay (req, parent) {
  if (skip.otherParentWorkAndPay(req.session.data, parent)) {
    return true
  }

  return validateParentYesNoFields(req, parent, {
    'other-parent-work': 'Select whether or not your partner meets the work threshold',
    'other-parent-pay': 'Select whether or not your partner meets the pay threshold'
  })
}

module.exports = {
  natureOfParenthood,
  caringWithPartner,
  startDate,
  whichParent,
  employmentStatus,
  workAndPay,
  otherParentWorkAndPay
}
