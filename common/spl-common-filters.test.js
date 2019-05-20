'use strict'

const { describe, it, beforeEach } = require('mocha')
const { expect } = require('chai')

const Day = require('../common/lib/day')

describe('filters', () => {
  describe('offsetWeeks', () => {
    let filters, environment
    beforeEach(() => {
      environment = {}
      filters = require('./spl-common-filters')(environment)
    })

    it('adds the appropriate number of weeks to the provided date', () => {
      const baseDay = new Day('2019', '10', '01')

      const result = filters.offsetWeeks(baseDay, 2)
      expect(result.formatForDisplay()).to.equal('15 October 2019')
    })

    it('when provided a negative number, subtracts weeks from the provided week', () => {
      const baseDay = new Day('2018', '07', '23')

      const result = filters.offsetWeeks(baseDay, -3)
      expect(result.formatForDisplay()).to.equal('2 July 2018')
    })
  })
})
