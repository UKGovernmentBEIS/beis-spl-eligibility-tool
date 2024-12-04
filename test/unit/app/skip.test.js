const { expect } = require('chai')
const { describe, it, beforeEach } = require('mocha')
const skip = require('../../../app/skip')
const createParentData = require('../../test_helpers/createParentData')

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
    const testCases = [
      { whichParent: 'both', parent: 'secondary', expected: true },
      { whichParent: 'primary', parent: 'primary', expected: true },
      { whichParent: 'both', parent: 'primary', expected: false },
      { whichParent: 'primary', parent: 'secondary', expected: true },
      { whichParent: 'secondary', parent: 'secondary', expected: true }
    ]

    testCases.forEach(({ whichParent, parent, expected }) => {
      it(`should return ${expected} if which-parent is "${whichParent}" and parent is "${parent}"`, () => {
        data['which-parent'] = whichParent
        expect(skip.nextParent(data, parent)).to.equal(expected)
      })
    })
  })

  describe('employmentStatus', () => {
    const testCases = [
      { data: { 'which-parent': 'secondary' }, parent: 'primary', expected: true },
      { data: { 'which-parent': 'primary' }, parent: 'secondary', expected: true },
      { data: { 'which-parent': 'both' }, parent: 'primary', expected: false },
      { data: { 'which-parent': 'both' }, parent: 'secondary', expected: false }
    ]

    testCases.forEach(({ data, parent, expected }) => {
      it(`should return ${expected} if parent is "${parent}" and which-parent is "${data['which-parent']}"`, () => {
        expect(skip.employmentStatus(data, parent)).to.equal(expected)
      })
    })
  })

  describe('parentMeetsPayAndContinuousWorkThresholds', () => {
    const testCases = [
      {
        primary: createParentData('employee', 'yes', 'yes', 'yes'),
        parent: 'primary',
        expected: true,
        message: 'should return true when parent meets pay and continuous work thresholds'
      },
      {
        primary: createParentData('', 'yes', 'no', 'no'),
        parent: 'primary',
        expected: false,
        message: 'should return false when only pay threshold is met'
      },
      {
        primary: createParentData('', 'no', 'yes', 'yes'),
        parent: 'primary',
        expected: false,
        message: 'should return false when only continuous work threshold is met'
      },
      {
        primary: createParentData('', 'no', 'no', 'no'),
        parent: 'primary',
        expected: false,
        message: 'should return false when parent does not meet both pay and continuous work thresholds'
      },
      {
        secondary: createParentData('employee', 'yes', 'yes', 'yes'),
        parent: 'secondary',
        expected: true,
        message: 'should return true when parent meets pay and continuous work thresholds for secondary parent'
      },
      {
        secondary: createParentData('', 'no', 'yes', 'yes'),
        parent: 'secondary',
        expected: false,
        message: 'should return false when only pay threshold is met for secondary parent'
      },
      {
        secondary: createParentData('', 'yes', 'no', 'no'),
        parent: 'secondary',
        expected: false,
        message: 'should return false when only continuous work threshold is met for secondary parent'
      }
    ]

    testCases.forEach(({ primary, secondary, parent, expected, message }) => {
      it(`${message}`, () => {
        if (primary) data.primary = primary
        if (secondary) data.secondary = secondary
        expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, parent)).to.equal(expected)
      })
    })
  })

  describe('otherParentWorkAndPay', () => {
    const testCases = [
      {
        whichParent: 'secondary',
        parent: 'primary',
        expected: true,
        message: 'should return true when which-parent is "secondary" and parent is "primary"'
      },
      {
        whichParent: 'primary',
        parent: 'secondary',
        expected: true,
        message: 'should return true when which-parent is "primary" and parent is "secondary"'
      },
      {
        whichParent: 'primary',
        parent: 'primary',
        expected: false,
        message: 'should return false when which-parent is "primary" and parent is "primary"'
      },
      {
        whichParent: 'secondary',
        parent: 'secondary',
        expected: false,
        message: 'should return false when which-parent is "secondary" and parent is "secondary"'
      },
      {
        secondary: createParentData('employee', 'yes', 'yes', 'yes'),
        whichParent: 'both',
        parent: 'primary',
        expected: true,
        message: 'should return true when which-parent is "both" and parent is "primary"'
      },
      {
        primary: createParentData('self-employed', '', '', ''),
        parent: 'primary',
        expected: true,
        message: 'should return true when parent is self-employed'
      },
      {
        primary: createParentData('unemployed', '', '', ''),
        parent: 'primary',
        expected: true,
        message: 'should return true when parent is unemployed'
      },
      {
        secondary: createParentData('worker', 'no', 'no', 'no'),
        parent: 'primary',
        expected: false,
        message: 'should return false when parent is a worker and does not meet pay and work thresholds'
      },
      {
        secondary: createParentData('worker', 'yes', 'yes', 'yes'),
        primary: createParentData('worker', 'yes', 'yes', 'yes'),
        parent: 'primary',
        expected: true,
        message: 'should return true when parent is a worker and does meet pay and work thresholds'
      },
      {
        primary: createParentData('employee', '', 'no', 'no'),
        parent: 'primary',
        expected: true,
        message: 'should return true when parent is an employee and does not meet continuous work thresholds'
      },
      {
        secondary: createParentData('employee', '', 'yes', 'yes'),
        parent: 'primary',
        expected: false,
        message: 'should return false when parent is an employee and does meet continuous work thresholds'
      },
      {
        data: {},
        parent: 'primary',
        expected: false,
        message: 'should return false when parent does not have data'
      },
      {
        data: { primary: {} },
        parent: 'secondary',
        expected: false,
        message: 'should return false when data for the other parent is missing'
      },
      {
        data: { secondary: {} },
        parent: 'primary',
        expected: false,
        message: 'should return false when data for the other parent is missing'
      },
      {
        secondary: createParentData('employee', 'no', '', ''),
        parent: 'primary',
        expected: false,
        message: 'should return false when other parent is an employee but does not meet pay thresholds'
      },
      {
        secondary: createParentData('employee', 'yes', '', ''),
        parent: 'primary',
        expected: true,
        message: 'should return true when other parent is an employee and does meet pay thresholds'
      },
      {
        primary: createParentData('employee', 'yes', 'yes', 'yes'),
        secondary: createParentData('employee', 'yes', 'yes', 'yes'),
        parent: 'primary',
        expected: true,
        message: 'should return true when both parents meet pay thresholds'
      },
      {
        primary: createParentData('employee', 'yes', '', ''),
        parent: 'secondary',
        expected: true,
        message: 'should return true when other parent is an employee and does meet pay thresholds'
      },
      {
        primary: createParentData('worker', 'no', '', ''),
        parent: 'secondary',
        expected: false,
        message: 'should return false when other parent is a worker but does not meet pay thresholds'
      },
      {
        secondary: createParentData('employee', 'no', '', ''),
        parent: 'primary',
        expected: false,
        message: 'should return false when other parent is an employee but does not meet pay thresholds'
      },
      {
        secondary: createParentData('worker', 'yes', '', ''),
        parent: 'primary',
        expected: true,
        message: 'should return true when other parent is a worker and does meet pay thresholds'
      }
    ]

    testCases.forEach(({ primary, secondary, whichParent, parent, expected, message }) => {
      it(`${message}`, () => {
        if (primary) data.primary = primary
        if (secondary) data.secondary = secondary
        if (whichParent) data['which-parent'] = whichParent
        expect(skip.otherParentWorkAndPay(data, parent)).to.equal(expected)
      })
    })
  })

  describe('otherParent', () => {
    const testCases = [
      {
        secondary: createParentData('self-employed', 'no', '', ''),
        parent: 'primary',
        expected: false,
        message: 'should return false when otherParent is "secondary, "self-employed" and does not meet pay threshold'
      },
      {
        primary: createParentData('unemployed', 'no', '', ''),
        parent: 'secondary',
        expected: false,
        message: 'should return false when otherParent is "primary", "unemployed" and does not meet pay threshold'
      }
    ]

    testCases.forEach(({ primary, secondary, parent, expected, message }) => {
      it(`${message}`, () => {
        if (primary) data.primary = primary
        if (secondary) data.secondary = secondary
        expect(skip.otherParentWorkAndPay(data, parent)).to.equal(expected)
      })
    })
  })
})
