const { expect } = require('chai')
const { describe, it, beforeEach } = require('mocha')
const skip = require('../../../app/skip')
const createParentData = require('../../test_helpers/createParentData')
const testCases = require('../../shared/skipTestCases')

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
    testCases.nextParent.forEach(({ whichParent, parent, expected, message }) => {
      it(`${message}`, () => {
        data['which-parent'] = whichParent
        expect(skip.nextParent(data, parent)).to.equal(expected)
      })
    })
  })

  describe('employmentStatus', () => {
    testCases.employmentStatus.forEach(({ whichParent, parent, expected, message }) => {
      it(`${message}`, () => {
        data['which-parent'] = whichParent
        expect(skip.employmentStatus(data, parent)).to.equal(expected)
      })
    })
  })

  describe('parentMeetsPayAndContinuousWorkThresholds', () => {
    testCases.parentMeetsPayAndContinuousWorkThresholds.forEach(({ primary, secondary, parent, expected, message }) => {
      it(`${message}`, () => {
        if (primary) data.primary = primary
        if (secondary) data.secondary = secondary
        expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, parent)).to.equal(expected)
      })
    })
  })

  describe('otherParentWorkAndPay', () => {
    testCases.otherParentWorkAndPay.forEach(({ primary, secondary, whichParent, parent, expected, message }) => {
      it(`${message}`, () => {
        if (primary) data.primary = primary
        if (secondary) data.secondary = secondary
        if (whichParent) data['which-parent'] = whichParent
        expect(skip.otherParentWorkAndPay(data, parent)).to.equal(expected)
      })
    })
  })

  describe('otherParent', () => {
    testCases.otherParent.forEach(({ primary, secondary, parent, expected, message }) => {
      it(`${message}`, () => {
        if (primary) data.primary = primary
        if (secondary) data.secondary = secondary
        expect(skip.otherParentWorkAndPay(data, parent)).to.equal(expected)
      })
    })
  })
})
