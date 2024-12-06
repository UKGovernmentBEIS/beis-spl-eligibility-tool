const { describe, beforeEach } = require('mocha')
const skip = require('../../../app/skip')
const testCases = require('../../shared/skipTestCases')
const helperFunctions = require('../../test_helpers/helperFunctions')
const sharedBehaviourTests = require('../../test_helpers/sharedBehaviourTests')

describe('skip.js', () => {
  let data

  beforeEach(() => {
    data = {
      primary: helperFunctions.createParentData('', '', '', ''),
      secondary: helperFunctions.createParentData('', '', '', ''),
      'which-parent': ''
    }
  })

  describe('nextParent', () => {
    sharedBehaviourTests.runSkipTests(testCases.nextParent, skip.nextParent, data)
  })

  describe('employmentStatus', () => {
    sharedBehaviourTests.runSkipTests(testCases.employmentStatus, skip.employmentStatus, data)
  })

  describe('parentMeetsPayAndContinuousWorkThresholds', () => {
    sharedBehaviourTests.runSkipTests(testCases.parentMeetsPayAndContinuousWorkThresholds, skip.parentMeetsPayAndContinuousWorkThresholds, data)
  })

  describe('otherParentWorkAndPay', () => {
    sharedBehaviourTests.runSkipTests(testCases.otherParentWorkAndPay, skip.otherParentWorkAndPay, data)
  })

  describe('otherParent', () => {
    sharedBehaviourTests.runSkipTests(testCases.otherParent, skip.otherParentWorkAndPay, data)
  })
})
