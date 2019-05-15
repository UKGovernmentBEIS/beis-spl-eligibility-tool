// Existing filters can be imported from env using env.getFilter(name)
// See https://mozilla.github.io/nunjucks/api.html#getfilter

const moment = require('moment')
const dates = require('../common/utils/dateUtils')

module.exports = function (env) {
  function relevantWeek (data) {
    const {
      'start-date-day': day,
      'start-date-month': month,
      'start-date-year': year
    } = data

    const startOfWeekProvided = dates.convertToMoment(year, month, day).startOf('week')
    const qualifyingWeek = env.getFilter('isBirth')(data) ? startOfWeekProvided.subtract(105, 'days') : startOfWeekProvided
    return dates.standardFormat(qualifyingWeek)
  }

  function twentySixWeeksBeforeRelevantWeek (data) {
    const relevantWeekValue = relevantWeek(data)
    const twentySixWeeksBefore = moment(relevantWeekValue).subtract(26 * 7, 'days')
    return dates.standardFormat(twentySixWeeksBefore)
  }

  function formatForDisplay (standardFormatDate) {
    return dates.formatForDisplay(standardFormatDate)
  }

  function isInPast (standardFormatDate) {
    return dates.isInPast(standardFormatDate)
  }

  return {
    relevantWeek,
    twentySixWeeksBeforeRelevantWeek,
    formatForDisplay,
    isInPast
  }
}
