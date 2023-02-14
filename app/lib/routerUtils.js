const qs = require('qs')
const { pick } = require('lodash')
const paths = require('../paths')
const { isBirth, isSurrogacy } = require('../../common/lib/dataUtils')
const Day = require('../../common/lib/day')
const {
  getEligibility,
  ELIGIBILITY
} = require('./eligibility')

function registerRouteForEachParent (router, path, handlers) {
  const parents = ['mother', 'primary-adopter', 'parental-order-parent', 'partner']
  for (const parent of parents) {
    const route = router.route(paths.getPath(`${path}.${parent}`))
    if (handlers.get) {
      route.get(handlers.get.bind(this, parent))
    }
    if (handlers.post) {
      route.post(handlers.post.bind(this, parent))
    }
  }
}

function getParent (parentUrlPart) {
  return parentUrlPart === 'partner' ? 'secondary' : 'primary'
}

function plannerQueryString (data, timings) {
  function convertEligibility (eligibility) {
    switch (eligibility) {
      case ELIGIBILITY.ELIGIBLE:
        return 'yes'
      case ELIGIBILITY.NOT_ELIGIBLE:
        return 'no'
      default:
        return 'unknown'
    }
  }

  const dataForPlanner = pick(data, 'nature-of-parenthood')

  if (isBirth(data) || isSurrogacy(data)) {
    dataForPlanner['due-date'] = new Day(data['start-date-year'], data['start-date-month'], data['start-date-day']).format('YYYY-MM-DD')
  }

  ['primary', 'secondary'].forEach(parent => {
    ['spl', 'shpp'].forEach(policy => {
      dataForPlanner[`${parent}-${policy}-eligible`] = convertEligibility(getEligibility(data, parent, policy))
    })
  })

  dataForPlanner.eligibilityStart = timings.eligibilityStart

  return qs.stringify(dataForPlanner)
}

function getJourneyTime (timings) {
  const time = timings.eligibilityEnd - timings.eligibilityStart
  return Math.round(time / 1000)
}

module.exports = {
  registerRouteForEachParent,
  getParent,
  plannerQueryString,
  getJourneyTime
}
