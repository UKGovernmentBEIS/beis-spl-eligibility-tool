function isEligible (eligibilityData, policy) {
  if (eligibilityData === undefined) { return }

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
    return false
  }

  if ([
    employmentStatus,
    workStart,
    continuousWork,
    payThreshold,
    otherParentWork,
    otherParentPay
  ].some(value => value === undefined)) {
    return undefined
  }

  if (policy === 'spl') {
    if (employmentStatus === 'worker') { return false }
    return isYes(workStart) && isYes(continuousWork)
  } else if (policy === 'shpp') {
    return isYes(workStart) && isYes(continuousWork) && isYes(payThreshold)
  }
}

module.exports = isEligible
