const { expect } = require('chai')
const { describe, it } = require('mocha')
const routerUtils = require('../../../../app/lib/routerUtils')

describe('getParent', () => {
  it('should return primary for mother, primary-adopter and parental-order-parent', () => {
    expect(routerUtils.getParent('mother')).to.equal('primary')
    expect(routerUtils.getParent('primary-adopter')).to.equal('primary')
    expect(routerUtils.getParent('parental-order-parent')).to.equal('primary')
  })

  it('should return secondary for partner', () => {
    expect(routerUtils.getParent('partner')).to.equal('secondary')
  })
})

describe('plannerQueryString', () => {
  it('should return correct query string for birth data', () => {
    const data = {
      primary: {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      },
      secondary: {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      },
      'nature-of-parenthood': 'birth',
      'start-date-year': 2023,
      'start-date-month': 10,
      'start-date-day': 15
    }
    const timings = {
      eligibilityStart: 1000
    }
    const result = routerUtils.plannerQueryString(data, timings)
    expect(result).to.include('nature-of-parenthood=birth')
    expect(result).to.include('due-date=2023-10-15')
    expect(result).to.include('primary-spl-eligible=yes')
    expect(result).to.include('secondary-spl-eligible=yes')
    expect(result).to.include('eligibilityStart=1000')
  })

  it('should return correct query string for surrogacy data', () => {
    const data = {
      primary: {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      },
      secondary: {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      },
      'nature-of-parenthood': 'surrogacy',
      'start-date-year': 2023,
      'start-date-month': 10,
      'start-date-day': 15
    }
    const timings = {
      eligibilityStart: 1000
    }
    const result = routerUtils.plannerQueryString(data, timings)
    expect(result).to.include('nature-of-parenthood=surrogacy')
    expect(result).to.include('due-date=2023-10-15')
    expect(result).to.include('primary-spl-eligible=yes')
    expect(result).to.include('secondary-spl-eligible=yes')
    expect(result).to.include('eligibilityStart=1000')
  })

  it('should return correct query string for self-employed and unemployed parents', () => {
    const data = {
      primary: {
        'employment-status': 'self-employed',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      },
      secondary: {
        'employment-status': 'unemployed',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      },
      'nature-of-parenthood': 'birth',
      'start-date-year': 2023,
      'start-date-month': 10,
      'start-date-day': 15
    }
    const timings = {
      eligibilityStart: 1000
    }
    const result = routerUtils.plannerQueryString(data, timings)
    expect(result).to.include('nature-of-parenthood=birth')
    expect(result).to.include('due-date=2023-10-15')
    expect(result).to.include('primary-spl-eligible=no')
    expect(result).to.include('secondary-spl-eligible=no')
    expect(result).to.include('eligibilityStart=1000')
  })

  it('should return unknown for no data', () => {
    const data = {}
    const timings = {}
    const result = routerUtils.plannerQueryString(data, timings)
    expect(result).to.include('primary-spl-eligible=unknown')
    expect(result).to.include('secondary-spl-eligible=unknown')
  })
})

describe('getJourneyTime', () => {
  it('should return the correct journey time in seconds', () => {
    const timings = {
      eligibilityStart: 1000,
      eligibilityEnd: 6000
    }
    const result = routerUtils.getJourneyTime(timings)
    expect(result).to.equal(5)
  })

  it('should return 0 if start and end times are the same', () => {
    const timings = {
      eligibilityStart: 1000,
      eligibilityEnd: 1000
    }
    const result = routerUtils.getJourneyTime(timings)
    expect(result).to.equal(0)
  })

  it('should handle negative journey times correctly', () => {
    const timings = {
      eligibilityStart: 6000,
      eligibilityEnd: 1000
    }
    const result = routerUtils.getJourneyTime(timings)
    expect(result).to.equal(-5)
  })
})
