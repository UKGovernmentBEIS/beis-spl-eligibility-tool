const { describe, it } = require('mocha')
const { expect } = require('chai')

const isEligible = require('./isEligible')

describe('isEligible', () => {
  it('returns false if other parent does not meet work threshold', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': 'no',
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(false)
    expect(isEligible(testData, 'shpp')).to.equal(false)
  })

  it('returns false if other parent does not meet pay threshold', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': 'yes',
      'other-parent-pay': 'no'
    }

    expect(isEligible(testData, 'spl')).to.equal(false)
    expect(isEligible(testData, 'shpp')).to.equal(false)
  })

  it('returns undefined if employment-status not provided', () => {
    const testData = {
      'employment-status': undefined,
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': 'yes',
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(undefined)
    expect(isEligible(testData, 'shpp')).to.equal(undefined)
  })

  it('returns undefined if work-start not provided', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': undefined,
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': 'yes',
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(undefined)
    expect(isEligible(testData, 'shpp')).to.equal(undefined)
  })

  it('returns undefined if continuous-work not provided', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': undefined,
      'pay-threshold': 'yes',
      'other-parent-work': 'yes',
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(undefined)
    expect(isEligible(testData, 'shpp')).to.equal(undefined)
  })

  it('returns undefined if pay-threshold not provided', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': undefined,
      'other-parent-work': 'yes',
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(undefined)
    expect(isEligible(testData, 'shpp')).to.equal(undefined)
  })

  it('returns undefined if other-parent-work not provided', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': undefined,
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(undefined)
    expect(isEligible(testData, 'shpp')).to.equal(undefined)
  })

  it('returns undefined if other-parent-pay not provided', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': 'yes',
      'other-parent-pay': undefined
    }

    expect(isEligible(testData, 'spl')).to.equal(undefined)
    expect(isEligible(testData, 'shpp')).to.equal(undefined)
  })

  describe('for spl', () => {
    it('returns false if employment status is "worker"', () => {
      const testData = {
        'employment-status': 'worker',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }

      expect(isEligible(testData, 'spl')).to.equal(false)
    })

    describe('when emploment status is "employee"', () => {
      it('returns false if work-start === "no"', () => {
        const testData = {
          'employment-status': 'employee',
          'work-start': 'no',
          'continuous-work': 'yes',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }

        expect(isEligible(testData, 'spl')).to.equal(false)
      })

      it('returns false if continuous-work === "no"', () => {
        const testData = {
          'employment-status': 'employee',
          'work-start': 'yes',
          'continuous-work': 'no',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }

        expect(isEligible(testData, 'spl')).to.equal(false)
      })

      it('returns true if continuous-work === "yes" and work-start === "yes"', () => {
        const testData = {
          'employment-status': 'employee',
          'work-start': 'yes',
          'continuous-work': 'yes',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }

        expect(isEligible(testData, 'spl')).to.equal(true)
      })
    })
  })

  describe('for shpp', () => {
    it('returns false if work-start === "no"', () => {
      const testData = {
        'employment-status': 'employee',
        'work-start': 'no',
        'continuous-work': 'yes',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }

      expect(isEligible(testData, 'shpp')).to.equal(false)
    })

    it('returns false if continuous-work === "no"', () => {
      const testData = {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'no',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }

      expect(isEligible(testData, 'shpp')).to.equal(false)
    })

    it('returns false if pay-threshold === "no"', () => {
      const testData = {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'no',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }

      expect(isEligible(testData, 'shpp')).to.equal(false)
    })

    it('returns true if work-start, continuous-work and pay-threshold are all yes', () => {
      const testData = {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }

      expect(isEligible(testData, 'shpp')).to.equal(true)
    })
  })
})
