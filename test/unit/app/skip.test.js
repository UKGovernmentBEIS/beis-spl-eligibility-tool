const { expect } = require('chai')
const { describe, it, beforeEach } = require('mocha')
const skip = require('../../../app/skip')

const createParentData = (employmentStatus, payThreshold, continuousWork, workStart) => ({
  'employment-status': employmentStatus,
  'pay-threshold': payThreshold,
  'continuous-work': continuousWork,
  'work-start': workStart
})

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
    it('should return true if which-parent is "both" and parent is "secondary"', () => {
      data['which-parent'] = 'both'

      expect(skip.nextParent(data, 'secondary')).to.equal(true)
    })

    it('should return true if which-parent and parent are both "primary"', () => {
      data['which-parent'] = 'primary'

      expect(skip.nextParent(data, 'primary')).to.equal(true)
    })

    it('should return false if which-parent is "both" and parent is "primary"', () => {
      data['which-parent'] = 'both'

      expect(skip.nextParent(data, 'primary')).to.equal(false)
    })

    it('should return true if which-parent is "primary" and parent is "secondary"', () => {
      data['which-parent'] = 'primary'

      expect(skip.nextParent(data, 'secondary')).to.equal(true)
    })

    it('should return true if which-parent is "secondary" and parent is "secondary"', () => {
      data['which-parent'] = 'secondary'

      expect(skip.nextParent(data, 'secondary')).to.equal(true)
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
    it('should return true when parent meets pay and continuous work thresholds', () => {
      data.primary = createParentData('employee', 'yes', 'yes', 'yes')

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(true)
    })

    it('should return false when only pay threshold is met', () => {
      data.primary = createParentData('', 'yes', 'no', 'no')

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(false)
    })

    it('should return false when only continuous work threshold is met', () => {
      data.primary = createParentData('', 'no', 'yes', 'yes')

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(false)
    })

    it('should return false when parent does not meet both pay and continuous work thresholds', () => {
      data.primary = createParentData('', 'no', 'no', 'no')

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(false)
    })

    it('should return true when parent meets pay and continuous work thresholds for secondary parent', () => {
      data.secondary = createParentData('employee', 'yes', 'yes', 'yes')

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'secondary')).to.equal(true)
    })

    it('should return false when parent does not meet pay threshold for secondary parent', () => {
      data.secondary = createParentData('', 'no', 'yes', 'yes')

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'secondary')).to.equal(false)
    })

    it('should return false when parent does not meet continuous work threshold for secondary parent', () => {
      data.secondary = createParentData('', 'yes', 'no', 'no')

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'secondary')).to.equal(false)
    })
  })

  describe('otherParentWorkAndPay', () => {
    it('should return true when which-parent is "secondary" and parent is "primary"', () => {
      data['which-parent'] = 'secondary'

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when which-parent is "primary" and parent is "secondary"', () => {
      data['which-parent'] = 'primary'

      expect(skip.otherParentWorkAndPay(data, 'secondary')).to.equal(true)
    })

    it('should return false when which-parent is "primary" and parent is "primary"', () => {
      data['which-parent'] = 'primary'

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return false when which-parent is "secondary" and parent is "secondary"', () => {
      data['which-parent'] = 'secondary'

      expect(skip.otherParentWorkAndPay(data, 'secondary')).to.equal(false)
    })

    it('should return true when which-parent is "primary" and parent is "primary"', () => {
      data.secondary = createParentData('employee', 'yes', 'yes', 'yes')
      data['which-parent'] = 'both'

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when parent is self-employed', () => {
      data.primary = createParentData('self-employed', '', '', '')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when parent is unemployed', () => {
      data.primary = createParentData('unemployed', '', '', '')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return false when parent is a worker and does not meet pay and work thresholds', () => {
      data.secondary = createParentData('worker', 'no', 'no', 'no')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return true when parent is a worker and does meet pay and work thresholds', () => {
      data.primary = createParentData('worker', 'yes', 'yes', 'yes')
      data.secondary = createParentData('worker', 'yes', 'yes', 'yes')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when parent is an employee and does not meet continuous work thresholds', () => {
      data.primary = createParentData('employee', '', 'no', 'no')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return false when parent is an employee and does meet continuous work thresholds', () => {
      data.secondary = createParentData('employee', '', 'yes', 'yes')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return false when parent does not have data', () => {
      data = {}
      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return false when data for the other parent is missing', () => {
      data = { primary: {} }
      expect(skip.otherParentWorkAndPay(data, 'secondary')).to.equal(false)
    })

    it('should return false when data for the other parent is missing', () => {
      data = { secondary: {} }
      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return false when parent is an employee but does not meet pay thresholds', () => {
      data.secondary = createParentData('employee', 'no', '', '')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return true when parent is an employee and does meet pay threshold', () => {
      data.secondary = createParentData('employee', 'yes', '', '')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when both parents meet pay thresholds', () => {
      data.primary = createParentData('employee', 'yes', 'yes', 'yes')
      data.secondary = createParentData('worker', 'yes', 'yes', 'yes')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when other parent does meet pay threshold', () => {
      data.primary = createParentData('employee', 'yes', '', '')

      expect(skip.otherParentWorkAndPay(data, 'secondary')).to.equal(true)
    })

    it('should return false when other parent does not meet pay threshold', () => {
      data.primary = createParentData('worker', 'no', '', '')

      expect(skip.otherParentWorkAndPay(data, 'secondary')).to.equal(false)
    })

    it('should return false when other parent does not meet pay threshold', () => {
      data.secondary = createParentData('employee', 'no', '', '')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return true when other parent does meet pay threshold', () => {
      data.secondary = createParentData('worker', 'yes', '', '')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })
  })

  describe('otherParent', () => {
    it('should return false when otherParent is "secondary, "self-employed" and does not meet pay threshold', () => {
      data.secondary = createParentData('self-employed', 'no', '', '')

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return false when otherParent is "primary", "unemployed" and does not meet pay threshold', () => {
      data.primary = createParentData('unemployed', 'no', '', '')

      expect(skip.otherParentWorkAndPay(data, 'secondary')).to.equal(false)
    })
  })
})
