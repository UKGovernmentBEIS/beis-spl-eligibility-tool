const dlv = require('dlv')
const { isYes } = require('../../common/lib/dataUtils')

const ELIGIBILITY = Object.freeze({
  ELIGIBLE: 'eligible',
  NOT_ELIGIBLE: 'not eligible',
  UNKNOWN: 'unknown'
})

function isEmployee (eligibilityData) {
  return eligibilityData['employment-status'] === 'employee'
}

function isWorker (eligibilityData) {
  return eligibilityData['employment-status'] === 'worker'
}

function isEmployeeOrWorker (eligibilityData) {
  return isEmployee(eligibilityData) || isWorker(eligibilityData)
}

function hasCompletedCurrentParentThresholds (eligibilityData) {
  return !!(eligibilityData['pay-threshold'] && eligibilityData['continuous-work'] && eligibilityData['work-start'])
}

function otherParentMeetsWorkAndPayThresholds (thisParentEligibility, otherParentEligibility) {
  return (isYes(thisParentEligibility['other-parent-work']) && isYes(thisParentEligibility['other-parent-pay'])) ||
          isYes(dlv(otherParentEligibility, 'pay-threshold'))
}

function currentParentMeetsPayThreshold (eligibilityData) {
  const meetsPayThreshold = isYes(eligibilityData['pay-threshold'])
  return isEmployeeOrWorker(eligibilityData) && meetsPayThreshold
}

function currentParentMeetsContinuousWorkThreshold (eligibilityData) {
  const meetsWorkThreshold = isYes(eligibilityData['continuous-work']) && isYes(eligibilityData['work-start'])
  return isEmployeeOrWorker(eligibilityData) && meetsWorkThreshold
}

function getEligibility (data, parent, policy) {
  const thisParentEligibility = data[parent]
  const otherParent = parent === 'primary' ? 'secondary' : 'primary'
  const otherParentEligibility = data[otherParent]

  if (thisParentEligibility === undefined) {
    return ELIGIBILITY.UNKNOWN
  }

  if (!thisParentEligibility['employment-status']) {
    return ELIGIBILITY.UNKNOWN
  }

  if (!isEmployeeOrWorker(thisParentEligibility)) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  if (policy === 'spl' && isWorker(thisParentEligibility)) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  if (!hasCompletedCurrentParentThresholds(thisParentEligibility)) {
    return ELIGIBILITY.UNKNOWN
  }

  if (policy === 'spl' && !currentParentMeetsContinuousWorkThreshold(thisParentEligibility)) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  if (
    policy === 'shpp' &&
    (!currentParentMeetsContinuousWorkThreshold(thisParentEligibility) ||
     !currentParentMeetsPayThreshold(thisParentEligibility)
    )
  ) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  if (!otherParentMeetsWorkAndPayThresholds(thisParentEligibility, otherParentEligibility)) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  return ELIGIBILITY.ELIGIBLE
}

module.exports = {
  ELIGIBILITY,
  currentParentMeetsPayThreshold,
  currentParentMeetsContinuousWorkThreshold,
  getEligibility,
  isWorker,
  isEmployee
}
