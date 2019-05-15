'use strict'

const { describe, it, beforeEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')

const moment = require('moment')

const Day = require('../common/lib/day')

describe('filters', () => {
  let filters, environment

  beforeEach(() => {
    environment = {
      getFilter: () => {}
    }
    filters = require('./filters')(environment)
  })

  describe('relevantWeek', () => {
    it('returns the start of the match week for adopters', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => false)

      const data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }

      const result = filters.relevantWeek(data)
      expect(result.formatForDisplay()).to.equal('29 September 2019')
    })

    it('returns 15 weeks before the start of the birth week for birth parents', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => true)

      const data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }

      const result = filters.relevantWeek(data)
      expect(result.formatForDisplay()).to.equal('16 June 2019')
    })

    it('always returns a sunday', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => false)

      const dataWithSunday = {
        'start-date-day': '29',
        'start-date-month': '09',
        'start-date-year': '2019'
      }

      const result = filters.relevantWeek(dataWithSunday)
      expect(result.formatForDisplay()).to.equal('29 September 2019')
    })
  })

  describe('formatForDisplay', () => {
    it("returns a string in the form '1 December 2019'", () => {
      const testWeek = new Day('2019', '10', '09')
      expect(filters.formatForDisplay(testWeek)).to.equal('9 October 2019')
    })
  })

  describe('twentySixWeeksBeforeRelevantWeek', () => {
    it('returns 26 weeks before the start of the match week for adopters', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => false)

      const data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }

      const result = filters.twentySixWeeksBeforeRelevantWeek(data)
      expect(result.formatForDisplay()).to.equal('31 March 2019')
    })

    it('returns 26 weeks before 15 weeks before the start of the birth week for birth parents', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => true)

      const data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }

      const result = filters.twentySixWeeksBeforeRelevantWeek(data)
      expect(result.formatForDisplay()).to.equal('16 December 2018')
    })
  })

  describe('eightWeeksBeforeRelevantWeek', () => {
    it('returns 8 weeks before the start of the match week for adopters', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => false)

      const data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }

      const result = filters.eightWeeksBeforeRelevantWeek(data)
      expect(result.formatForDisplay()).to.equal('4 August 2019')
    })

    it('returns 8 weeks before 15 weeks before the start of the birth week for birth parents', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => true)

      const data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }

      const result = filters.eightWeeksBeforeRelevantWeek(data)
      expect(result.formatForDisplay()).to.equal('21 April 2019')
    })
  })

  describe('isInPast', () => {
    it('returns true for a date in the past', () => {
      const today = moment()
      const testDay = new Day(today.subtract(1, 'days'))

      expect(filters.isInPast(testDay)).to.equal(true)
    })

    it('returns false for a date in the future', () => {
      const today = moment()
      const testDay = new Day(today)

      expect(filters.isInPast(testDay)).to.equal(false)
    })

    it('returns false for the current date', () => {
      const today = moment()
      const testDay = new Day(today.add(1, 'days'))

      expect(filters.isInPast(testDay)).to.equal(false)
    })
  })
})
