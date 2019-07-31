const {
  currentParentMeetsPayThreshold,
  currentParentMeetsContinuousWorkThreshold,
  isWorker,
  isEmployee
} = require('./lib/eligibility')

function employmentStatus (req, parent) {
  if (entireParent(req, parent)) {
    return true
  }
  return false
}

function workAndPay (req, parent) {
  if (entireParent(req, parent)) {
    return true
  }
  if (parentIsSelfEmployedOrUnemployed(req, parent)) {
    return true
  }
  return false
}

function otherParentWorkAndPay (req, parent) {
  if (entireParent(req, parent)) {
    return true
  }

  if (parentIsSelfEmployedOrUnemployed(req, parent)) {
    return true
  }

  if (parentIsWorker(req, parent) && !parentMeetsPayAndContinuousWorkThresholds(req, parent)) {
    return true
  }

  if (parentIsEmployee(req, parent) && !parentMeetsContinuousWorkThreshold(req, parent)) {
    return true
  }
  if (req.session.data['which-parent'] === 'both' && parent === 'secondary' && currentParentMeetsPayThreshold(req.session.data['primary'])) {
    // skip step if secondary information implied by answers to primary questions
    return true
  }

  return false
}

function nextParent (req, parent) {
  return parent === 'secondary' || req.session.data['which-parent'] !== 'both'
}

function entireParent (req, parent) {
  if (parent === 'primary') {
    return req.session.data['which-parent'] === 'secondary'
  } else {
    return req.session.data['which-parent'] === 'primary'
  }
}

function parentIsSelfEmployedOrUnemployed (req, parent) {
  return ['self-employed', 'unemployed'].includes(req.session.data[parent]['employment-status'])
}

function parentMeetsContinuousWorkThreshold (req, parent) {
  return currentParentMeetsContinuousWorkThreshold(req.session.data[parent])
}

function parentMeetsPayAndContinuousWorkThresholds (req, parent) {
  return parentMeetsContinuousWorkThreshold(req, parent) &&
         currentParentMeetsPayThreshold(req.session.data[parent])
}

function parentIsWorker (req, parent) {
  return isWorker(req.session.data[parent])
}

function parentIsEmployee (req, parent) {
  return isEmployee(req.session.data[parent])
}

module.exports = {
  employmentStatus,
  workAndPay,
  otherParentWorkAndPay,
  nextParent
}
