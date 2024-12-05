const { describe, beforeEach } = require('mocha')
const skip = require('../../../app/skip')
const testCases = require('../../shared/skipTestCases')
const sharedHelperFunctions = require('../../test_helpers/sharedHelperFunctions')

describe('skip.js', () => {
  let data

  beforeEach(() => {
    data = {
      primary: sharedHelperFunctions.createParentData('', '', '', ''),
      secondary: sharedHelperFunctions.createParentData('', '', '', ''),
      'which-parent': ''
    }
  })

  describe('nextParent', () => {
    sharedHelperFunctions.runSkipTests(testCases.nextParent, skip.nextParent, data)
  })

  describe('employmentStatus', () => {
    sharedHelperFunctions.runSkipTests(testCases.employmentStatus, skip.employmentStatus, data)
  })

  describe('parentMeetsPayAndContinuousWorkThresholds', () => {
    sharedHelperFunctions.runSkipTests(testCases.parentMeetsPayAndContinuousWorkThresholds, skip.parentMeetsPayAndContinuousWorkThresholds, data)
  })

  describe('otherParentWorkAndPay', () => {
    sharedHelperFunctions.runSkipTests(testCases.otherParentWorkAndPay, skip.otherParentWorkAndPay, data)
  })

  describe('otherParent', () => {
    sharedHelperFunctions.runSkipTests(testCases.otherParent, skip.otherParentWorkAndPay, data)
  })
})
