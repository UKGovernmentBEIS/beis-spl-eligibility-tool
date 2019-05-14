// Existing filters can be imported from env using env.getFilter(name)
// See https://mozilla.github.io/nunjucks/api.html#getfilter
const { convertToMoment, formatForDisplay, standardFormat } = require('../common/utils/dateUtils')

module.exports = function (env) {
  function twentySixWeeksBeforeRelevantWeek (data) {
    const {
      'start-date-day': day,
      'start-date-month': month,
      'start-date-year': year
    } = data

    const startOfWeekProvided = convertToMoment(year, month, day).startOf('week')
    const qualifyingWeek = env.getFilter('isBirth')(data) ? startOfWeekProvided.subtract(105, 'days') : startOfWeekProvided
    return standardFormat(qualifyingWeek)
  }

  function displayFormat (standardFormatDate) {
    return formatForDisplay(standardFormatDate)
  }

  return {
    twentySixWeeksBeforeRelevantWeek,
    displayFormat
  }
}
