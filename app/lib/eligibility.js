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

  if (!otherParentMeetsWorkAndPayThresholds(eligibilityData)) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  if (policy === 'spl') {
    if (isEmployee(eligibilityData) && currentParentMeetsContinuousWorkThreshold(eligibilityData)) {
      return ELIGIBILITY.ELIGIBLE
    } else {
      return ELIGIBILITY.NOT_ELIGIBLE
    }
  } else if (policy === 'shpp') {
    if (currentParentMeetsPayThreshold(eligibilityData) &&
        currentParentMeetsContinuousWorkThreshold(eligibilityData)
    ) {
      return ELIGIBILITY.ELIGIBLE
    } else {
      return ELIGIBILITY.NOT_ELIGIBLE
    }
  }
}

module.exports = {
  ELIGIBILITY,
  currentParentMeetsPayThreshold,
  currentParentMeetsContinuousWorkThreshold,
  getEligibility
}
