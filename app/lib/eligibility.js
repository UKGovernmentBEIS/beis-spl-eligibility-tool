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

function hasCompletedOtherParentThresholds (eligibilityData) {
  return !!(eligibilityData['other-parent-work'] && eligibilityData['other-parent-pay'])
}

function otherParentMeetsWorkAndPayThresholds (eligibilityData) {
  return isYes(eligibilityData['other-parent-work']) && isYes(eligibilityData['other-parent-pay'])
}

function currentParentMeetsPayThreshold (eligibilityData) {
  const meetsPayThreshold = isYes(eligibilityData['pay-threshold'])
  return isEmployeeOrWorker(eligibilityData) && meetsPayThreshold
}

function currentParentMeetsContinuousWorkThreshold (eligibilityData) {
  const meetsWorkThreshold = isYes(eligibilityData['continuous-work']) && isYes(eligibilityData['work-start'])
  return isEmployeeOrWorker(eligibilityData) && meetsWorkThreshold
}

function getEligibility (eligibilityData, policy) {
  if (eligibilityData === undefined) {
    return ELIGIBILITY.UNKNOWN
  }

  if (!eligibilityData['employment-status']) {
    return ELIGIBILITY.UNKNOWN
  }

  if (!isEmployeeOrWorker(eligibilityData)) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  if (policy === 'spl' && isWorker(eligibilityData)) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  if (!hasCompletedCurrentParentThresholds(eligibilityData)) {
    return ELIGIBILITY.UNKNOWN
  }

  if (policy === 'spl' && !currentParentMeetsContinuousWorkThreshold(eligibilityData)) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  if (
    policy === 'shpp' &&
    (!currentParentMeetsContinuousWorkThreshold(eligibilityData) ||
      !currentParentMeetsPayThreshold(eligibilityData)
    )
  ) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  if (!hasCompletedOtherParentThresholds(eligibilityData)) {
    return ELIGIBILITY.UNKNOWN
  }

  if (!otherParentMeetsWorkAndPayThresholds(eligibilityData)) {
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
