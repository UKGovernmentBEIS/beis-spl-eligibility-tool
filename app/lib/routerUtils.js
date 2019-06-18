const delve = require('dlv')
const { isYes } = require('../../common/lib/dataUtils')
const paths = require('../paths')

function registerRouteForEachParent (router, path, handlers) {
  const parents = ['mother', 'primary-adopter', 'partner']
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

function parentMeetsContinuousWorkThreshold (data, parent) {
  return isYes(delve(data, [parent, 'work-start'])) && isYes(delve(data, [parent, 'continuous-work']))
}

function parentMeetsPayThreshold (data, parent) {
  return delve(data, [parent, 'employment-status']) === 'employee' && isYes(delve(data, [parent, 'pay-threshold']))
}

module.exports = {
  registerRouteForEachParent,
  getParent,
  parentMeetsPayThreshold,
  parentMeetsContinuousWorkThreshold
}
