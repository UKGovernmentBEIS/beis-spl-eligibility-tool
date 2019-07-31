const {
  currentParentMeetsPayThreshold,
  currentParentMeetsContinuousWorkThreshold,
  isWorker,
  isEmployee
} = require('./lib/eligibility')

function employmentStatus (data, parent) {
  if (entireParent(data, parent)) {
    return true
  }
  return false
}

function workAndPay (data, parent) {
  if (entireParent(data, parent)) {
    return true
  }
  if (parentIsSelfEmployedOrUnemployed(data, parent)) {
    return true
  }
  return false
}

function otherParentWorkAndPay (data, parent) {
  if (entireParent(data, parent)) {
    return true
  }

  if (parentIsSelfEmployedOrUnemployed(data, parent)) {
    return true
  }

  if (parentIsWorker(data, parent) && !parentMeetsPayAndContinuousWorkThresholds(data, parent)) {
    return true
  }

  if (parentIsEmployee(data, parent) && !parentMeetsContinuousWorkThreshold(data, parent)) {
    return true
  }
  if (data['which-parent'] === 'both' && parent === 'secondary' && currentParentMeetsPayThreshold(data['primary'])) {
    // skip step if secondary information implied by answers to primary questions
    return true
  }

  return false
}

function nextParent (data, parent) {
  return parent === 'secondary' || data['which-parent'] !== 'both'
}

function entireParent (data, parent) {
  if (parent === 'primary') {
    return data['which-parent'] === 'secondary'
  } else {
    return data['which-parent'] === 'primary'
  }
}

function parentIsSelfEmployedOrUnemployed (data, parent) {
  return ['self-employed', 'unemployed'].includes(data[parent]['employment-status'])
}

function parentMeetsContinuousWorkThreshold (data, parent) {
  return currentParentMeetsContinuousWorkThreshold(data[parent])
}

function parentMeetsPayAndContinuousWorkThresholds (data, parent) {
  return parentMeetsContinuousWorkThreshold(data, parent) &&
         currentParentMeetsPayThreshold(data[parent])
}

function parentIsWorker (data, parent) {
  return isWorker(data[parent])
}

function parentIsEmployee (data, parent) {
  return isEmployee(data[parent])
}

module.exports = {
  employmentStatus,
  workAndPay,
  otherParentWorkAndPay,
  nextParent
}
