const { describe, it } = require('mocha')
const { expect } = require('chai')

const { getEligibility, ELIGIBILITY } = require('./eligibility')

describe('getEligibility', () => {
  it('returns not eligible if other parent does not meet work threshold', () => {
    const testData = {
      primary: {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes',
        'other-parent-work': 'no',
        'other-parent-pay': 'yes'
      }
    }

    expect(getEligibility(testData, 'primary', 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    expect(getEligibility(testData, 'primary', 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
  })

  it("returns not eligible if other parent does not meet pay threshold from this parent's eligiblity questions", () => {
    const testData = {
      primary: {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'no'
      }
    }

    expect(getEligibility(testData, 'primary', 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    expect(getEligibility(testData, 'primary', 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
  })

  it("returns not eligible if other parent does not meet pay threshold from other parent's eligibility questions", () => {
    const testData = {
      primary: {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'no',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      },
      secondary: {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      }
    }

    expect(getEligibility(testData, 'secondary', 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    expect(getEligibility(testData, 'secondary', 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
  })

  it('returns unknown if employment-status not provided', () => {
    const testData = {
      primary: {
        'employment-status': undefined,
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes',
        'other-parent-work': 'yes',
        'other-parent-pay': 'yes'
      }
    }

    expect(getEligibility(testData, 'primary', 'spl')).to.equal(ELIGIBILITY.UNKNOWN)
    expect(getEligibility(testData, 'primary', 'shpp')).to.equal(ELIGIBILITY.UNKNOWN)
  })

  describe('for spl', () => {
    it('returns not eligible if employment status is "worker"', () => {
      const testData = {
        primary: {
          'employment-status': 'worker',
          'work-start': 'yes',
          'continuous-work': 'yes',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }
      }

      expect(getEligibility(testData, 'primary', 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    })

    describe('when employment status is "employee"', () => {
      it('returns not eligible if work-start === "no"', () => {
        const testData = {
          primary: {
            'employment-status': 'employee',
            'work-start': 'no',
            'continuous-work': 'yes',
            'pay-threshold': 'yes',
            'other-parent-work': 'yes',
            'other-parent-pay': 'yes'
          }
        }

        expect(getEligibility(testData, 'primary', 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
      })

      it('returns not eligible if continuous-work === "no"', () => {
        const testData = {
          primary: {
            'employment-status': 'employee',
            'work-start': 'yes',
            'continuous-work': 'no',
            'pay-threshold': 'yes',
            'other-parent-work': 'yes',
            'other-parent-pay': 'yes'
          }
        }

        expect(getEligibility(testData, 'primary', 'spl')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
      })

      it('returns eligible if continuous-work === "yes" and work-start === "yes"', () => {
        const testData = {
          primary: {
            'employment-status': 'employee',
            'work-start': 'yes',
            'continuous-work': 'yes',
            'pay-threshold': 'yes',
            'other-parent-work': 'yes',
            'other-parent-pay': 'yes'
          }
        }

        expect(getEligibility(testData, 'primary', 'spl')).to.equal(ELIGIBILITY.ELIGIBLE)
      })
    })
  })

  describe('for shpp', () => {
    it('returns not eligible if work-start === "no"', () => {
      const testData = {
        primary: {
          'employment-status': 'employee',
          'work-start': 'no',
          'continuous-work': 'yes',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }
      }

      expect(getEligibility(testData, 'primary', 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    })

    it('returns not eligible if continuous-work === "no"', () => {
      const testData = {
        primary: {
          'employment-status': 'employee',
          'work-start': 'yes',
          'continuous-work': 'no',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }
      }

      expect(getEligibility(testData, 'primary', 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    })

    it('returns not eligible if pay-threshold === "no"', () => {
      const testData = {
        primary: {
          'employment-status': 'employee',
          'work-start': 'yes',
          'continuous-work': 'no',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }
      }

      expect(getEligibility(testData, 'primary', 'shpp')).to.equal(ELIGIBILITY.NOT_ELIGIBLE)
    })

    it('returns eligible if work-start, continuous-work and pay-threshold are all yes', () => {
      const testData = {
        primary: {
          'employment-status': 'employee',
          'work-start': 'yes',
          'continuous-work': 'yes',
          'pay-threshold': 'yes',
          'other-parent-work': 'yes',
          'other-parent-pay': 'yes'
        }
      }

      expect(getEligibility(testData, 'primary', 'shpp')).to.equal(ELIGIBILITY.ELIGIBLE)
    })
  })
})
