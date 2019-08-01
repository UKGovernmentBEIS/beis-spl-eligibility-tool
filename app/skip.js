const {
  currentParentMeetsPayThreshold,
  currentParentMeetsContinuousWorkThreshold,
  isWorker,
  isEmployee
} = require('./lib/eligibility')

function employmentStatus (data, parent) {
  return entireParent(data, parent)
}

function workAndPay (data, parent) {
  return entireParent(data, parent) || parentIsSelfEmployedOrUnemployed(data, parent)
}

function otherParentWorkAndPay (data, parent) {
  return entireParent(data, parent) ||
         parentIsSelfEmployedOrUnemployed(data, parent) ||
         (parentIsWorker(data, parent) && !parentMeetsPayAndContinuousWorkThresholds(data, parent)) ||
         (parentIsEmployee(data, parent) && !parentMeetsContinuousWorkThreshold(data, parent)) ||
         // skip step if secondary information implied by answers to primary questions
         (data['which-parent'] === 'both' && parent === 'secondary' && currentParentMeetsPayThreshold(data['primary']))
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
