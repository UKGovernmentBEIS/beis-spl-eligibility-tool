const delve = require('dlv')

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
  const otherParent = parent === 'primary' ? 'secondary' : 'primary'
  return entireParent(data, parent) ||
         parentIsSelfEmployedOrUnemployed(data, parent) ||
         (parentIsWorker(data, parent) && !parentMeetsPayAndContinuousWorkThresholds(data, parent)) ||
         (parentIsEmployee(data, parent) && !parentMeetsContinuousWorkThreshold(data, parent)) ||
         // skip step if information implied by answers to other parent's questions
         (currentParentMeetsPayThreshold(data[otherParent]))
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
  const employmentStatus = delve(data, [parent, 'employment-status'])
  return ['self-employed', 'unemployed'].includes(employmentStatus)
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
