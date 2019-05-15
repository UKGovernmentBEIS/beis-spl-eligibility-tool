// Existing filters can be imported from env using env.getFilter(name)
// See https://mozilla.github.io/nunjucks/api.html#getfilter

const Week = require('../common/lib/week')

module.exports = function (env) {
  function relevantWeek (data) {
    const providedWeek = buildStartDateWeek(data)

    if (env.getFilter('isBirth')(data)) {
      return providedWeek.start().subtract(105, 'days')
    } else {
      return providedWeek.start()
    }
  }

  function twentySixWeeksBeforeRelevantWeek (data) {
    const twentySixWeeksBefore = relevantWeek(data).subtract(26 * 7, 'days')
    return twentySixWeeksBefore
  }

  function eightWeeksBeforeRelevantWeek (data) {
    const startOfEighthWeek = relevantWeek(data).subtract(56, 'days')
    return startOfEighthWeek
  }

  function formatForDisplay (week) {
    return week.formatForDisplay()
  }

  function isInPast (week) {
    return week.isInPast()
  }

  return {
    relevantWeek,
    twentySixWeeksBeforeRelevantWeek,
    eightWeeksBeforeRelevantWeek,
    formatForDisplay,
    isInPast
  }
}

function buildStartDateWeek (data) {
  const {
    'start-date-day': day,
    'start-date-month': month,
    'start-date-year': year
  } = data

  return new Week(year, month, day)
}
