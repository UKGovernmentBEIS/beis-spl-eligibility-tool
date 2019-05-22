const Day = require('../common/lib/day')
const isEligible = require('./lib/isEligible')
const paths = require('./paths')

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

  function formatForDisplay (day) {
    return day.formatForDisplay()
  }

  function isInPast (day) {
    return day.isInPast()
  }

  function getCurrentParentFromUrl (urlParent) {
    return urlParent === 'mother' || urlParent === 'primary-adopter' ? 'primary' : 'secondary'
  }

  function displayEligiblity (data, parent, policy) {
    const isParentEligible = isEligible(data[parent], policy)
    switch (isParentEligible) {
      case true:
        return 'Eligible ✔'
      case false:
        return 'Not eligible ✘'
      case undefined:
        return 'Eligibility unknown'
      default:
        console.log('unknown eligibility')
    }
  }

  function hasStartDateError (errors, partOfDate) {
    return errors && errors['start-date'] && errors['start-date'].some(err => err.dateParts.includes(partOfDate))
  }

  return {
    relevantWeek,
    formatForDisplay,
    isInPast,
    getCurrentParentFromUrl,
    displayEligiblity,
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
