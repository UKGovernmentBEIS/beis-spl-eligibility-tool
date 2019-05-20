// Existing filters can be imported from env using env.getFilter(name)
// See https://mozilla.github.io/nunjucks/api.html#getfilter

const Day = require('../common/lib/day')
const isEligible = require('./lib/isEligible')

module.exports = function (env) {
  function relevantWeek (data) {
    const providedDate = getProvidedDate(data)

    if (env.getFilter('isBirth')(data)) {
      return providedDate.startOfWeek().subtract(105, 'days')
    } else {
      return providedDate.startOfWeek()
    }
  }

  function twentySixWeeksBeforeRelevantWeek (data) {
    return relevantWeek(data).subtract(26 * 7, 'days')
  }

  function eightWeeksBeforeRelevantWeek (data) {
    return relevantWeek(data).subtract(56, 'days')
  }

  function sixtySixWeeksBeforeRelevantWeek (data) {
    return relevantWeek(data).subtract(66 * 7, 'days')
  }

  function formatForDisplay (day) {
    return day.formatForDisplay()
  }

  function isInPast (day) {
    return day.isInPast()
  }

  function getCurrentParentFromUrl (urlParent) {
    if (urlParent === 'mother' || urlParent === 'primary-adopter') {
      return 'primary'
    } else {
      return 'secondary'
    }
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
    twentySixWeeksBeforeRelevantWeek,
    eightWeeksBeforeRelevantWeek,
    sixtySixWeeksBeforeRelevantWeek,
    formatForDisplay,
    isInPast,
    getCurrentParentFromUrl,
    displayEligiblity,
    hasStartDateError
  }
}

function getProvidedDate (data) {
  const {
    'start-date-day': day,
    'start-date-month': month,
    'start-date-year': year
  } = data

  return new Day(year, month, day)
}
