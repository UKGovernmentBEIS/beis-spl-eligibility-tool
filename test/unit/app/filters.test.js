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
  })

  describe('relevantWeek', () => {
    it('returns the start of the match week for adopters', () => {
      sinon.stub(environment, 'getFilter')
        .withArgs('isBirth').returns(() => false)
        .withArgs('isAdoption').returns(() => true)
      filters = require('../../../app/filters')(environment)

      const data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }

      const result = filters.relevantWeek(data)
      expect(result.format('YYYY-MM-DD')).to.equal('2019-09-29')
    })

    it('returns 15 weeks before the start of the birth week for birth parents', () => {
      sinon.stub(environment, 'getFilter')
        .withArgs('isBirth').returns(() => true)
        .withArgs('isAdoption').returns(() => false)
      filters = require('../../../app/filters')(environment)

      const data = {
        'start-date-day': '01',
        'start-date-month': '10',
        'start-date-year': '2019'
      }

      const result = filters.relevantWeek(data)
      expect(result.format('YYYY-MM-DD')).to.equal('2019-06-16')
    })

    it('always returns a sunday', () => {
      sinon.stub(environment, 'getFilter')
        .withArgs('isBirth').returns(() => false)
        .withArgs('isAdoption').returns(() => true)
      filters = require('../../../app/filters')(environment)

      const dataWithSunday = {
        'start-date-day': '29',
        'start-date-month': '09',
        'start-date-year': '2019'
      }

      const result = filters.relevantWeek(dataWithSunday)
      expect(result.format('YYYY-MM-DD')).to.equal('2019-09-29')
    })
  })
})
