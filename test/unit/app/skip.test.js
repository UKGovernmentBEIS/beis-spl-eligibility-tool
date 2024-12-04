const { expect } = require('chai')
const { describe, it, beforeEach } = require('mocha')
const skip = require('../../../app/skip')

describe('skip.js', () => {
  let data

  beforeEach(() => {
    data = {
      primary: {
        'pay-threshold': '',
        'continuous-work': '',
        'employment-status': '',
        'work-start': ''
      },
      secondary: {
        'pay-threshold': '',
        'continuous-work': '',
        'employment-status': '',
        'work-start': ''
      },
      'which-parent': ''
    }
  })

  describe('nextParent', () => {
    it('should return true if which-parent is "secondary"', () => {
      const data = { 'which-parent': 'both' }

      expect(skip.nextParent(data, 'secondary')).to.equal(true)
    })

    it('should return true if which-parent is not "both"', () => {
      const data = { 'which-parent': 'primary' }

      expect(skip.nextParent(data, 'primary')).to.equal(true)
    })

    it('should return false if which-parent is "both" and parent is "primary"', () => {
      const data = { 'which-parent': 'both' }

      expect(skip.nextParent(data, 'primary')).to.equal(false)
    })

    it('should return true if which-parent is "primary" and parent is "secondary', () => {
      const data = { 'which-parent': 'primary' }

      expect(skip.nextParent(data, 'secondary')).to.equal(true)
    })

    it('should return false if which-parent is "both" and parent is "primary"', () => {
      const data = { 'which-parent': 'both' }

      expect(skip.nextParent(data, 'primary')).to.equal(false)
    })

    it('should return true if which-parent is "secondary" and parent is "secondary"', () => {
      const data = { 'which-parent': 'secondary' }

      expect(skip.nextParent(data, 'secondary')).to.equal(true)
    })

    it('should return false if which-parent is "both" and parent is "secondary"', () => {
      const data = { 'which-parent': 'both' }

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
      data.primary = {
        'employment-status': 'employee',
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'work-start': 'yes'
      }

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(true)
    })

    it('should return false when only pay threshold is met', () => {
      data.primary = {
        'pay-threshold': 'yes',
        'continuous-work': 'no',
        'work-start': 'no'
      }

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(false)
    })

    it('should return false when only continuous work threshold is met', () => {
      data.primary = {
        'pay-threshold': 'no',
        'continuous-work': 'yes',
        'work-start': 'yes'
      }

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(false)
    })

    it('should return false when parent does not meet both pay and continuous work thresholds', () => {
      data.primary = {
        'pay-threshold': 'no',
        'continuous-work': 'no',
        'work-start': 'no'
      }

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(false)
    })

    it('should return true when parent meets pay and continuous work thresholds for secondary parent', () => {
      data.secondary = {
        'employment-status': 'employee',
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'work-start': 'yes'
      }

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'secondary')).to.equal(true)
    })

    it('should return false when parent does not meet pay threshold for secondary parent', () => {
      data.secondary = {
        'pay-threshold': 'no',
        'continuous-work': 'yes',
        'work-start': 'yes'
      }

      expect(skip.parentMeetsPayAndContinuousWorkThresholds(data, 'secondary')).to.equal(false)
    })

    it('should return false when parent does not meet continuous work threshold for secondary parent', () => {
      data.secondary = {
        'pay-threshold': 'yes',
        'continuous-work': 'no',
        'work-start': 'no'
      }

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
      data.secondary = {
        'employment-status': 'employee',
        'continuous-work': 'yes',
        'pay-threshold': 'yes',
        'work-start': 'yes'
      }
      data['which-parent'] = 'primary'

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when parent is self-employed', () => {
      data.primary['employment-status'] = 'self-employed'

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when parent is unemployed', () => {
      data.primary['employment-status'] = 'unemployed'

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return false when parent is a worker and does not meet pay and work thresholds', () => {
      data.secondary = {
        'employment-status': 'worker',
        'pay-threshold': 'no',
        'continuous-work': 'no',
        'work-start': 'no'
      }

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return true when parent is a worker and does meet pay and work thresholds', () => {
      data.primary = {
        'employment-status': 'worker',
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'work-start': 'yes'
      }
      data.secondary = {
        'employment-status': 'worker',
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'work-start': 'yes'
      }

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when parent is an employee and does not meet continuous work thresholds', () => {
      data.primary = {
        'employment-status': 'employee',
        'continuous-work': 'no',
        'work-start': 'no'
      }

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return false when parent is an employee and does meet continuous work thresholds', () => {
      data.secondary = {
        'employment-status': 'employee',
        'continuous-work': 'yes',
        'work-start': 'yes'
      }

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
      data.secondary = {
        'employment-status': 'employee',
        'pay-threshold': 'no'
      }

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return true when parent is an employee and does meet pay threshold', () => {
      data.secondary = {
        'employment-status': 'employee',
        'pay-threshold': 'yes'
      }

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when both parents meet pay thresholds', () => {
      data.primary = {
        'employment-status': 'employee',
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'work-start': 'yes'
      }
      data.secondary = {
        'employment-status': 'worker',
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'work-start': 'yes'
      }

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })

    it('should return true when other parent does meet pay threshold', () => {
      data.primary = {
        'employment-status': 'employee',
        'pay-threshold': 'yes'
      }

      expect(skip.otherParentWorkAndPay(data, 'secondary')).to.equal(true)
    })

    it('should return false when other parent does not meet pay threshold', () => {
      data.primary = {
        'employment-status': 'worker',
        'pay-threshold': 'no'
      }

      expect(skip.otherParentWorkAndPay(data, 'secondary')).to.equal(false)
    })

    it('should return false when other parent does not meet pay threshold', () => {
      data.secondary = {
        'employment-status': 'employee',
        'pay-threshold': 'no'
      }

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return true when other parent does meet pay threshold', () => {
      data.secondary = {
        'employment-status': 'worker',
        'pay-threshold': 'yes'
      }

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(true)
    })
  })

  describe('otherParent', () => {
    it('should return false when otherParent is "secondary, "self-employed" and does not meet pay threshold', () => {
      data.secondary = {
        'pay-threshold': 'no',
        'employment-status': 'self-employed'
      }

      expect(skip.otherParentWorkAndPay(data, 'primary')).to.equal(false)
    })

    it('should return false when otherParent is "primary", "unemployed" and does not meet pay threshold', () => {
      data.primary = {
        'pay-threshold': 'no',
        'employment-status': 'unemployed'
      }

      expect(skip.otherParentWorkAndPay(data, 'secondary')).to.equal(false)
    })
  })
})
