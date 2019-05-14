'use strict'

const { describe, it, beforeEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')

describe('filters', () => {
  let filters, environment

  beforeEach(() => {
    environment = {
      getFilter: () => {}
    }
    filters = require('./filters')(environment)
  })

  describe('twentySixWeeksBeforeRelevantWeek', () => {
    it('returns the start of the match week for adopters', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => false)

      const data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }

      expect(filters.twentySixWeeksBeforeRelevantWeek(data)).to.equal('29 September 2019')
    })

    it('returns 105 days before the start of the birth week for birth parents', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => true)

      const data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }

      expect(filters.twentySixWeeksBeforeRelevantWeek(data)).to.equal('16 June 2019')
    })

    it('always returns a sunday', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => false)

      const dataWithSunday = {
        'start-date-day': '29',
        'start-date-month': '09',
        'start-date-year': '2019'
      }

      expect(filters.twentySixWeeksBeforeRelevantWeek(dataWithSunday)).to.equal('29 September 2019')
    })
  })
})
