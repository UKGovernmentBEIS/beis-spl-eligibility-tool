// Existing filters can be imported from env using env.getFilter(name)
// See https://mozilla.github.io/nunjucks/api.html#getfilter

const Day = require('../common/lib/day')

module.exports = function (env) {
  function relevantWeek (data) {
    const providedDate = startOfProvidedDateWeek(data)

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

  function formatForDisplay (day) {
    return day.formatForDisplay()
  }

  function isInPast (day) {
    return day.isInPast()
  }

  return {
    relevantWeek,
    twentySixWeeksBeforeRelevantWeek,
    eightWeeksBeforeRelevantWeek,
    formatForDisplay,
    isInPast
  }
}

function startOfProvidedDateWeek (data) {
  const {
    'start-date-day': day,
    'start-date-month': month,
    'start-date-year': year
  } = data

  return new Day(year, month, day)
}
