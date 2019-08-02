const dset = require('dset')
const Day = require('../common/lib/day')
const eligibility = require('./lib/eligibility')

// Existing filters can be imported from env using env.getFilter(name)
// See https://mozilla.github.io/nunjucks/api.html#getfilter

module.exports = function (env) {
  const isBirth = env.getFilter('isBirth')
  const isAdoption = env.getFilter('isAdoption')
  const isSurrogacy = env.getFilter('isSurrogacy')
  const isInPast = env.getFilter('isInPast')

  // The week used as a baseline in eligibility calculations.
  // For birth parents, this is 15 weeks before the week of the due date.
  // For adoptive parents, this is the week of the match date.
  function relevantWeek (data) {
    const providedDate = getProvidedDate(data)
    const startOfWeek = providedDate.startOfWeek()
    return isAdoption(data) ? startOfWeek : startOfWeek.subtract(15, 'weeks')
  }

  function providedDateName (data) {
    if (isBirth(data) || isSurrogacy(data)) {
      return isInPast(relevantWeek(data)) ? 'birth' : 'due'
    } else {
      return 'match'
    }
  }

  function currentParentInitialLeaveName (data, currentParent) {
    if (currentParent === 'primary') {
      return isBirth(data) ? 'maternity' : 'adoption'
    } else {
      return 'paternity'
    }
  }

  function isWorker (data, parent) {
    return eligibility.isWorker(data[parent])
  }

  function eligibilityLabel (data, parent, policy) {
    switch (getParentEligibility(data, parent, policy)) {
      case eligibility.ELIGIBILITY.ELIGIBLE:
        return 'eligible'
      case eligibility.ELIGIBILITY.NOT_ELIGIBLE:
        return 'not eligible'
      default:
        return 'Eligibility unknown'
    }
  }

  function eligibilityIcon (data, parent, policy) {
    const parentEligibility = getParentEligibility(data, parent, policy)
    const eligibilityUnknownIcon = '<span aria-hidden="true"><strong>?</strong></span>'
    switch (parentEligibility) {
      case eligibility.ELIGIBILITY.ELIGIBLE:
        return isWorker(data, parent) ? eligibilityUnknownIcon : '<span aria-hidden="true">✔</span>'
      case eligibility.ELIGIBILITY.NOT_ELIGIBLE:
        return '<span aria-hidden="true">✘</span>'
      default:
        return eligibilityUnknownIcon
    }
  }

  function hasCheckedEligibility (data, parent) {
    return getParentEligibility(data, parent, 'spl') !== eligibility.ELIGIBILITY.UNKNOWN
  }

  function hasCheckedAnyEligibility (data) {
    return hasCheckedEligibility(data, 'primary') || hasCheckedEligibility(data, 'secondary')
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

  function resultsAnalyticsData (data) {
    const parents = ['primary', 'secondary']
    const policies = ['spl', 'shpp']
    const output = { nature_of_parenthood: data['nature-of-parenthood'] }
    parents.forEach(parent => {
      policies.forEach(policy => {
        dset(output, `${parent}.${policy}`, getParentEligibility(data, parent, policy))
      })
    })
    return output
  }

  return {
    relevantWeek,
    providedDateName,
    currentParentInitialLeaveName,
    isWorker,
    eligibilityLabel,
    eligibilityIcon,
    hasCheckedAnyEligibility,
    hasCheckedEligibility,
    coupleHasAnyIneligibility,
    hasStartDateError,
    resultsAnalyticsData
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
  return getParentEligibility(data, parent, policy) === eligibility.ELIGIBILITY.NOT_ELIGIBLE
}

function getParentEligibility (data, parent, policy) {
  return eligibility.getEligibility(data, parent, policy)
}
