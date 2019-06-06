const ELIGIBILITY = Object.freeze({
  ELIGIBLE: 'eligible',
  NOT_ELIGIBLE: 'not eligible',
  UNKNOWN: 'unknown'
})

function isEligible (eligibilityData, policy) {
  if (eligibilityData === undefined) {
    return ELIGIBILITY.UNKNOWN
  }

  const isYes = field => field === 'yes'
  const isNo = field => field === 'no'

  const {
    'employment-status': employmentStatus,
    'work-start': workStart,
    'continuous-work': continuousWork,
    'pay-threshold': payThreshold,
    'other-parent-work': otherParentWork,
    'other-parent-pay': otherParentPay
  } = eligibilityData

  if (employmentStatus === 'self-employed' ||
      employmentStatus === 'unemployed' ||
      isNo(otherParentPay) ||
      isNo(otherParentWork)
  ) {
    return ELIGIBILITY.NOT_ELIGIBLE
  }

  if ([
    employmentStatus,
    workStart,
    continuousWork,
    payThreshold,
    otherParentWork,
    otherParentPay
  ].some(value => value === undefined)) {
    return ELIGIBILITY.UNKNOWN
  }

  if (policy === 'spl') {
    if (employmentStatus === 'worker') {
      return ELIGIBILITY.NOT_ELIGIBLE
    }
    return isYes(workStart) && isYes(continuousWork) ? ELIGIBILITY.ELIGIBLE : ELIGIBILITY.NOT_ELIGIBLE
  } else if (policy === 'shpp') {
    if (isYes(workStart) && isYes(continuousWork) && isYes(payThreshold)) {
      return ELIGIBILITY.ELIGIBLE
    } else {
      return ELIGIBILITY.NOT_ELIGIBLE
    }
  }
}

module.exports = {
  ELIGIBILITY,
  isEligible
}
