const { describe, beforeEach } = require('mocha')
const skip = require('../../../app/skip')
const createParentData = require('../../test_helpers/createParentData')
const testCases = require('../../shared/skipTestCases')
const { runSkipTests } = require('../../test_helpers/createSharedTests')

describe('skip.js', () => {
  let data

  beforeEach(() => {
    data = {
      primary: createParentData('', '', '', ''),
      secondary: createParentData('', '', '', ''),
      'which-parent': ''
    }
  })

  describe('nextParent', () => {
    runSkipTests(testCases.nextParent, skip.nextParent, data)
  })

  describe('employmentStatus', () => {
    runSkipTests(testCases.employmentStatus, skip.employmentStatus, data)
  })

  describe('parentMeetsPayAndContinuousWorkThresholds', () => {
    runSkipTests(testCases.parentMeetsPayAndContinuousWorkThresholds, skip.parentMeetsPayAndContinuousWorkThresholds, data)
  })

  describe('otherParentWorkAndPay', () => {
    runSkipTests(testCases.otherParentWorkAndPay, skip.otherParentWorkAndPay, data)
  })

  describe('otherParent', () => {
    runSkipTests(testCases.otherParent, skip.otherParentWorkAndPay, data)
  })
})
