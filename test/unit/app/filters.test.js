'use strict'

const { describe, it, beforeEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')
const testCases = require('../../shared/filtersTestCases')

describe('filters', () => {
  let filters, environment

  beforeEach(() => {
    environment = {
      getFilter: () => {}
    }
  })

  describe('relevantWeek', () => {
    let data

    beforeEach(() => {
      data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }
    })

    testCases.relevantWeek.forEach(({ isBirth, isAdoption, data: testData, expected, message }) => {
      it(`${message}`, () => {
        sinon.stub(environment, 'getFilter')
          .withArgs('isBirth').returns(() => isBirth)
          .withArgs('isAdoption').returns(() => isAdoption)
        filters = require('../../../app/filters')(environment)

        const result = filters.relevantWeek(testData || data)
        expect(result.format('YYYY-MM-DD')).to.equal(expected)
      })
    })
  })

  describe('providedDateName', () => {
    let data

    beforeEach(() => {
      data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }
    })

    testCases.providedDateName.forEach(({ isBirth, isAdoption, isSurrogacy, isInPast, expected }) => {
      it(`returns "${expected}" if isBirth is ${isBirth}, isAdoption is ${isAdoption}, isSurrogacy is ${isSurrogacy}, and isInPast is ${isInPast}`, () => {
        sinon.stub(environment, 'getFilter')
          .withArgs('isBirth').returns(() => isBirth)
          .withArgs('isAdoption').returns(() => isAdoption)
          .withArgs('isSurrogacy').returns(() => isSurrogacy)
          .withArgs('isInPast').returns(() => isInPast)
        filters = require('../../../app/filters')(environment)

        const result = filters.providedDateName(data)
        expect(result).to.equal(expected)
      })
    })
  })

  describe('currentParentInitialPayName', () => {
    let data

    beforeEach(() => {
      data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }
    })

    testCases.currentParentInitialPayName.forEach(({ isBirth, isAdoption, currentParent, expected }) => {
      it(`returns "${expected}" if currentParent is ${currentParent}, isBirth is ${isBirth} and isAdoption is ${isAdoption}`, () => {
        sinon.stub(environment, 'getFilter')
          .withArgs('isBirth').returns(() => isBirth)
          .withArgs('isAdoption').returns(() => isAdoption)
        filters = require('../../../app/filters')(environment)

        const result = filters.currentParentInitialPayName(data, currentParent)
        expect(result).to.equal(expected)
      })
    })
  })

  describe('isWorker', () => {
    let data

    beforeEach(() => {
      data = {
        primary: {
          'employment-status': ''
        },
        secondary: {
          'employment-status': ''
        }
      }
    })

    testCases.isWorker.forEach(({ employmentStatus, parent, expected, message }) => {
      it(`${message}`, () => {
        if (parent === 'primary') data.primary['employment-status'] = employmentStatus
        if (parent === 'secondary') data.secondary['employment-status'] = employmentStatus
        filters = require('../../../app/filters')(environment)

        expect(filters.isWorker(data, parent)).to.equal(expected)
      })
    })
  })

  describe('eligibilityLabel', () => {
    it('returns "eligible" if parent is eligible', () => {
      filters = require('../../../app/filters')(environment)
      const data = {
        primary: {
          'employment-status': 'employee',
          'pay-threshold': 'yes',
          'continuous-work': 'yes',
          'work-start': 'yes'
        },
        secondary: {
          'employment-status': 'employee',
          'pay-threshold': 'yes',
          'continuous-work': 'yes',
          'work-start': 'yes'
        }
      }

      const result = filters.eligibilityLabel(data, 'primary', 'spl')
      expect(result).to.equal('eligible')
    })

    it('returns "not eligible" if parent is not eligible', () => {
      filters = require('../../../app/filters')(environment)

      const data = {
        primary: {
          'employment-status': 'self-employed'
        }
      }

      const result = filters.eligibilityLabel(data, 'primary', 'spl')
      expect(result).to.equal('not eligible')
    })

    it('returns "Eligibility unknown" if eligibility is unknown', () => {
      filters = require('../../../app/filters')(environment)

      const data = {}

      const result = filters.eligibilityLabel(data, 'primary', 'spl')
      expect(result).to.equal('Eligibility unknown')
    })
  })

  describe('eligibilityIcon', () => {
    let data

    beforeEach(() => {
      data = {
        primary: {
          'employment-status': 'employee',
          'pay-threshold': 'yes',
          'continuous-work': 'yes',
          'work-start': 'yes'
        },
        secondary: {
          'employment-status': 'yes',
          'pay-threshold': 'yes',
          'continuous-work': 'yes',
          'work-start': 'yes'
        }
      }
    })

    testCases.eligibilityIcon.forEach(({ employmentStatus, policy, expected, message }) => {
      it(`${message}`, () => {
        filters = require('../../../app/filters')(environment)
        if (employmentStatus !== '') {
          data.primary['employment-status'] = employmentStatus
        } else {
          data = {}
        }

        const result = filters.eligibilityIcon(data, 'primary', policy)
        expect(result).to.equal(expected)
      })
    })
  })

  describe('hasCheckedAnyEligiblity', () => {
    let data

    beforeEach(() => {
      data = {
        primary: {
          'employment-status': '',
          'pay-threshold': '',
          'continuous-work': '',
          'work-start': ''
        },
        secondary: {
          'employment-status': '',
          'pay-threshold': '',
          'continuous-work': '',
          'work-start': ''
        }
      }
    })

    testCases.hasCheckedAnyEligibility.forEach(({ primary, secondary, expected, parent, message }) => {
      it(`${message}`, () => {
        filters = require('../../../app/filters')(environment)

        if (primary) data.primary = primary
        if (secondary) data.secondary = secondary
        if (!primary && !secondary) data = {}

        const result = filters.hasCheckedAnyEligibility(data, parent)
        expect(result).to.equal(expected)
      })
    })
  })

  describe('coupleHasAnyIneligibility', () => {
    testCases.coupleHasAnyIneligibility.forEach(({ data, expected, message }) => {
      it(`${message}`, () => {
        filters = require('../../../app/filters')(environment)

        const result = filters.coupleHasAnyIneligibility(data)
        expect(result).to.equal(expected)
      })
    })
  })

  describe('hasStartDateError', () => {
    testCases.hasStartDateError.forEach(({ errors, partOfDate, expected, message }) => {
      it(`${message}`, () => {
        filters = require('../../../app/filters')(environment)

        const result = filters.hasStartDateError(errors, partOfDate)
        expect(result).to.equal(expected)
      })
    })
  })

  describe('resultsAnalyticsData', () => {
    it('returns the eligibility data for each parent and policy', () => {
      filters = require('../../../app/filters')(environment)

      const data = {
        'nature-of-parenthood': 'birth',
        primary: {
          'employment-status': 'employee',
          'pay-threshold': 'yes',
          'continuous-work': 'yes',
          'work-start': 'yes'
        },
        secondary: {
          'employment-status': 'employee',
          'pay-threshold': 'yes',
          'continuous-work': 'yes',
          'work-start': 'yes'
        }
      }

      const result = filters.resultsAnalyticsData(data)
      expect(result).to.deep.equal({
        nature_of_parenthood: 'birth',
        primary: {
          spl: 'eligible',
          shpp: 'eligible'
        },
        secondary: {
          spl: 'eligible',
          shpp: 'eligible'
        }
      })
    })
  })
})
