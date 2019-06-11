const Day = require('../common/lib/day')
const { ELIGIBILITY, getEligibility } = require('./lib/eligibility')

// Existing filters can be imported from env using env.getFilter(name)
// See https://mozilla.github.io/nunjucks/api.html#getfilter

module.exports = function (env) {
  const isBirth = env.getFilter('isBirth')
  const isInPast = env.getFilter('isInPast')

  // The week used as a baseline in eligibility calculations.
  // For birth parents, this is 15 weeks before the week of the due date.
  // For adoptive parents, this is the week of the match date.
  function relevantWeek (data) {
    const providedDate = getProvidedDate(data)
    const startOfWeek = providedDate.startOfWeek()
    return isBirth(data) ? startOfWeek.subtract(15, 'weeks') : startOfWeek
  }

  function providedDateName (data) {
    if (isBirth(data)) {
      return isInPast(relevantWeek(data)) ? 'birth' : 'due'
    } else {
      return 'match'
    }
  }

  function eligibility (data, parent, policy) {
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
      isParentIneligile(data, 'primary', 'spl') ||
      isParentIneligile(data, 'primary', 'shpp') ||
      isParentIneligile(data, 'secondary', 'spl') ||
      isParentIneligile(data, 'secondary', 'shpp')
    )
  }

  function hasStartDateError (errors, partOfDate) {
    return errors && errors['start-date'] && errors['start-date'].dateParts.includes(partOfDate)
  }

  return {
    relevantWeek,
    providedDateName,
    eligibility,
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

function isParentIneligile (data, parent, policy) {
  return getParentEligibility(data, parent, policy) === ELIGIBILITY.NOT_ELIGIBLE
}

function getParentEligibility (data, parent, policy) {
  return getEligibility(data[parent], policy)
}
