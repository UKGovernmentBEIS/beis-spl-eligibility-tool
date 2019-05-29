const { describe, it } = require('mocha')
const { expect } = require('chai')

const { isEligible, ELIGIBILITY } = require('./eligibility')

describe('isEligible', () => {
  it('returns not eligible if other parent does not meet work threshold', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': 'no',
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
  })

  it('returns not eligible if other parent does not meet pay threshold', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': 'yes',
      'other-parent-pay': 'no'
    }

    expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
  })

  it('returns unknown if employment-status not provided', () => {
    const testData = {
      'employment-status': undefined,
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': 'yes',
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.UNKNOWN)
    expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.UNKNOWN)
  })

  it('returns unknown if work-start not provided', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': undefined,
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': 'yes',
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.UNKNOWN)
    expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.UNKNOWN)
  })

  it('returns unknown if continuous-work not provided', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': undefined,
      'pay-threshold': 'yes',
      'other-parent-work': 'yes',
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.UNKNOWN)
    expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.UNKNOWN)
  })

  it('returns unknown if pay-threshold not provided', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': undefined,
      'other-parent-work': 'yes',
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.UNKNOWN)
    expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.UNKNOWN)
  })

  it('returns unknown if other-parent-work not provided', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': undefined,
      'other-parent-pay': 'yes'
    }

    expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.UNKNOWN)
    expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.UNKNOWN)
  })

  it('returns unknown if other-parent-pay not provided', () => {
    const testData = {
      'employment-status': 'employee',
      'work-start': 'yes',
      'continuous-work': 'yes',
      'pay-threshold': 'yes',
      'other-parent-work': 'yes',
      'other-parent-pay': undefined
    }

    expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.UNKNOWN)
    expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.UNKNOWN)
  })

  describe('for spl', () => {
    it('returns not eligible if employment status is "worker"', () => {
      const testData = {
        'employment-status': 'worker',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }

      expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    })

    describe('when emploment status is "employee"', () => {
      it('returns not eligible if work-start === "no"', () => {
        const testData = {
          'employment-status': 'employee',
          'work-start': 'no',
          'continuous-work': 'yes',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }

        expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
      })

      it('returns not eligible if continuous-work === "no"', () => {
        const testData = {
          'employment-status': 'employee',
          'work-start': 'yes',
          'continuous-work': 'no',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }

        expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
      })

      it('returns eligible if continuous-work === "yes" and work-start === "yes"', () => {
        const testData = {
          'employment-status': 'employee',
          'work-start': 'yes',
          'continuous-work': 'yes',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }

        expect(isEligible(testData, 'spl')).to.equal(ELIGIBILITY.ELIGIBLE)
      })
    })
  })

  describe('for shpp', () => {
    it('returns not eligible if work-start === "no"', () => {
      const testData = {
        'employment-status': 'employee',
        'work-start': 'no',
        'continuous-work': 'yes',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }

      expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    })

    it('returns not eligible if continuous-work === "no"', () => {
      const testData = {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'no',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }

      expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    })

    it('returns not eligible if pay-threshold === "no"', () => {
      const testData = {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'no',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }

      expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    })

    it('returns eligible if work-start, continuous-work and pay-threshold are all yes', () => {
      const testData = {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }

      expect(isEligible(testData, 'shpp')).to.equal(ELIGIBILITY.ELIGIBLE)
    })
  })
})