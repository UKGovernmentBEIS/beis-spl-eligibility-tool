'use strict'

const { describe, it, beforeEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')

const Day = require('../common/lib/day')

describe('filters', () => {
  let filters, environment

  beforeEach(() => {
    environment = {
      getFilter: () => {}
    }
  })

  describe('relevantWeek', () => {
    it('returns the start of the match week for adopters', () => {
      sinon.stub(environment, 'getFilter').withArgs('isBirth').returns(() => false)
      filters = require('./filters')(environment)

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
      filters = require('./filters')(environment)

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
      filters = require('./filters')(environment)

      const dataWithSunday = {
        'start-date-day': '29',
        'start-date-month': '09',
        'start-date-year': '2019'
      }

      const result = filters.relevantWeek(dataWithSunday)
      expect(result.formatForDisplay()).to.equal('29 September 2019')
    })
  })
})
