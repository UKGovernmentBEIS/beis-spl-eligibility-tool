const Day = require('../common/lib/day')
const { ELIGIBILITY, getEligibility } = require('./lib/eligibility')

// Existing filters can be imported from env using env.getFilter(name)
// See https://mozilla.github.io/nunjucks/api.html#getfilter

module.exports = function (env) {
  const isBirth = env.getFilter('isBirth')

  // The week used as a baseline in eligibility calculations.
  // For birth parents, this is 15 weeks before the week of the due date.
  // For adoptive parents, this is the week of the match date.
  function relevantWeek (data) {
    const providedDate = getProvidedDate(data)
    const startOfWeek = providedDate.startOfWeek()
    return isBirth(data) ? startOfWeek.subtract(15, 'weeks') : providedDate.startOfWeek()
  }

  function getCurrentParentFromUrl (urlParent) {
    return urlParent === 'mother' || urlParent === 'primary-adopter' ? 'primary' : 'secondary'
  }

  function displayEligiblity (data, parent, policy) {
    switch (getParentEligibility(data, parent, policy)) {
      case ELIGIBILITY.ELIGIBLE:
        return 'Eligible ✔'
      case ELIGIBILITY.NOT_ELIGIBLE:
        return 'Not eligible ✘'
      default:
        return 'Eligibility unknown'
    }
  }

  function hasCheckedEligibility (data, parent) {
    return getParentEligibility(data, parent, 'spl') !== ELIGIBILITY.UNKNOWN
  }

  function coupleHasAnyIneligibility (data) {
    return (
      !isParentEligile(data, 'primary', 'spl') ||
      !isParentEligile(data, 'primary', 'shpp') ||
      !isParentEligile(data, 'secondary', 'spl') ||
      !isParentEligile(data, 'secondary', 'shpp')
    )
  }

  function hasStartDateError (errors, partOfDate) {
    return errors && errors['start-date'] && errors['start-date'].some(err => err.dateParts.includes(partOfDate))
  }

  return {
    relevantWeek,
    getCurrentParentFromUrl,
    displayEligiblity,
    hasCheckedEligibility,
    coupleHasAnyIneligibility,
    hasStartDateError
  }
}

// The date the user inputs in the form during the workflow.
// For birth parents, this is the due date.
// For adoptive parents, this is the match date.
function getProvidedDate (data) {
  const {
    'start-date-day': day,
    'start-date-month': month,
    'start-date-year': year
  } = data

  return new Day(year, month, day)
}

function isParentEligile (data, parent, policy) {
  return getParentEligibility(data, parent, policy) === ELIGIBILITY.ELIGIBLE
}

function getParentEligibility (data, parent, policy) {
  return getEligibility(data[parent], policy)
}
