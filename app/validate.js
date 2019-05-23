const delve = require('dlv')
const Day = require('../common/lib/day')
const {
  buildError,
  isYesOrNo,
  prettyList
} = require('./lib/validationUtils')

function birthOrAdoption (req) {
  if (!['birth', 'adoption'].includes(req.session.data['birth-or-adoption'])) {
    req.session.errors = { 'birth-or-adoption': 'Select either birth or adoption' }
    return false
  }
  return true
}

function caringWithPartner (req) {
  if (!isYesOrNo(req.session.data['caring-with-partner'])) {
    req.session.errors = { 'caring-with-partner': 'Select whether or not you are caring for the child with a partner' }
    return false
  }
  return true
}

function startDate (req) {
  function buildDateError (message, href, dateParts) {
    return Object.assign(buildError(message, href), { dateParts })
  }

  const date = {
    year: req.session.data['start-date-year'],
    month: req.session.data['start-date-month'],
    day: req.session.data['start-date-day']
  }

  if ([date.year, date.month, date.day].every(value => value === '')) {
    req.session.errors['start-date'] = [buildDateError('Enter a date', '#start-date-day', ['day', 'month', 'year'])]
    return false
  }

  if ([date.year, date.month, date.day].some(value => value === '')) {
    const errorParts = ['day', 'month', 'year'].filter(datePart => date[datePart] === '')
    req.session.errors['start-date'] = [buildDateError(`Date must include a ${prettyList(errorParts)}`, `#start-date-${errorParts[0]}`, errorParts)]
    return false
  }

  const startDate = new Day(date.year, date.month, date.day)

  if (!startDate.isValid()) {
    const errorParts = []
    if (startDate.invalidAt() === 2) { errorParts.push('day') }
    if (startDate.invalidAt() === 1) { errorParts.push('month') }
    if (startDate.invalidAt() === 0) { errorParts.push('year') }
    req.session.errors['start-date'] = [buildDateError('Enter a valid date', `#start-date-${errorParts[0]}`, errorParts)]
    return false
  }

  const earliestPermitted = new Day().subtract(1, 'year')
  const latestPermitted = new Day().add(1, 'year')
  if (!startDate.isBetween(earliestPermitted, latestPermitted)) {
    const errorMessage = `Date must be between ${earliestPermitted.formatForDisplay()} and ${latestPermitted.formatForDisplay()}`
    req.session.errors['start-date'] = [buildDateError(errorMessage, '#start-date-day', ['day', 'month', 'year'])]
    return false
  }
  return true
}

function employmentStatus (req) {
  const parent = req.params['current'] === 'partner' ? 'secondary' : 'primary'
  const employmentStatusAnswer = delve(req.session.data, [parent, 'employment-status'])
  const permittedValues = ['employee', 'worker', 'self-employed', 'unemployed']
  if (!permittedValues.includes(employmentStatusAnswer)) {
    req.session.errors['employment-status'] = buildError('Please indicate your employment status', '#employment-status-1')
    return false
  }
  return true
}

function workAndPay (req) {
  let isValid = true
  const parent = req.params['current'] === 'partner' ? 'secondary' : 'primary'
  const workStart = delve(req.session.data, [parent, 'work-start'])
  if (!isYesOrNo(workStart)) {
    req.session.errors['work-start'] = buildError('Please indicate when you started your job', '#work-start-1')
    isValid = false
  }
  const continuousWork = delve(req.session.data, [parent, 'continuous-work'])
  if (!isYesOrNo(continuousWork)) {
    req.session.errors['continuous-work'] = buildError('Please whether your work has been continuous during this time', '#continuous-work-1')
    isValid = false
  }
  const payThreshold = delve(req.session.data, [parent, 'pay-threshold'])
  if (!isYesOrNo(payThreshold)) {
    req.session.errors['pay-threshold'] = buildError('Please indicate whether you meet this pay threshold', '#pay-threshold-1')
    isValid = false
  }
  return isValid
}

function otherParentWorkAndPay (req) {
  let isValid = true
  const parent = req.params['current'] === 'partner' ? 'secondary' : 'primary'
  const otherParentWork = delve(req.session.data, [parent, 'other-parent-work'])
  if (!isYesOrNo(otherParentWork)) {
    req.session.errors['other-parent-work'] = buildError('Please whether your partner meets the work threshold', '#other-parent-work-1')
    isValid = false
  }
  const otherParentPay = delve(req.session.data, [parent, 'other-parent-pay'])
  if (!isYesOrNo(otherParentPay)) {
    req.session.errors['other-parent-pay'] = buildError('Please whether your partner meets the pay threshold', '#other-parent-pay-1')
    isValid = false
  }
  return isValid
}

module.exports = {
  birthOrAdoption,
  caringWithPartner,
  startDate,
  employmentStatus,
  workAndPay,
  otherParentWorkAndPay
}
