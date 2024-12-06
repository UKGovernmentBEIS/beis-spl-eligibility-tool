function createParentData (employmentStatus, payThreshold, workStart, continuousWork) {
  return {
    'employment-status': employmentStatus,
    'pay-threshold': payThreshold,
    'work-start': workStart,
    'continuous-work': continuousWork
  }
}

module.exports = {
  createParentData
}
