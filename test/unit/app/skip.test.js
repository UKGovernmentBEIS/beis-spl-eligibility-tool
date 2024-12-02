const { expect } = require('chai')
const { describe, it, beforeEach } = require('mocha')
const { parentMeetsPayAndContinuousWorkThresholds } = require('../../../app/skip')
const { nextParent } = require('../../../app/skip')
const { employmentStatus } = require('../../../app/skip')
const { otherParentWorkAndPay } = require('../../../app/skip')

describe('nextParent', () => {
  it('should return true if which-parent is secondary', () => {
    const data = {
      'which-parent': 'both'
    }
    expect(nextParent(data, 'secondary')).to.equal(true)
  })

  it('should return true if which-parent is not both', () => {
    const data = {
      'which-parent': 'primary'
    }
    expect(nextParent(data, 'primary')).to.equal(true)
  })

  it('should return false if which-parent is both and parent is primary', () => {
    const data = {
      'which-parent': 'both'
    }
    expect(nextParent(data, 'primary')).to.equal(false)
  })

  it('should return true if which-parent is primary and parent is secondary', () => {
    const data = {
      'which-parent': 'primary'
    }
    expect(nextParent(data, 'secondary')).to.equal(true)
  })

  it('should return false if which-parent is both and parent is primary', () => {
    const data = {
      'which-parent': 'both'
    }
    expect(nextParent(data, 'primary')).to.equal(false)
  })

  it('should return true if which-parent is secondary and parent is secondary', () => {
    const data = {
      'which-parent': 'secondary'
    }
    expect(nextParent(data, 'secondary')).to.equal(true)
  })

  it('should return false if which-parent is both and parent is secondary', () => {
    const data = {
      'which-parent': 'both'
    }
    expect(nextParent(data, 'secondary')).to.equal(true)
  })
})

describe('employmentStatus', () => {
  const testCases = [
    { data: { 'which-parent': 'secondary' }, parent: 'primary', expected: true },
    { data: { 'which-parent': 'primary' }, parent: 'secondary', expected: true },
    { data: { 'which-parent': 'both' }, parent: 'primary', expected: false },
    { data: { 'which-parent': 'both' }, parent: 'secondary', expected: false }
  ]

  testCases.forEach(({ data, parent, expected }) => {
    it(`should return ${expected} if parent is ${parent} and which-parent is ${data['which-parent']}`, () => {
      expect(employmentStatus(data, parent)).to.equal(expected)
    })
  })
})

describe('parentMeetsPayAndContinuousWorkThresholds', () => {
  let data

  beforeEach(() => {
    data = {
      primary: {
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'employment-status': 'employee',
        'work-start': 'yes'
      },
      secondary: {
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'employment-status': 'employee',
        'work-start': 'yes'
      }
    }
  })

  it('should return true when parent meets pay and continuous work thresholds', () => {
    expect(parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(true)
  })

  it('should return false when only pay threshold is met', () => {
    data.primary['pay-threshold'] = 'yes'
    data.primary['continuous-work'] = 'no'

    expect(parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(false)
  })

  it('should return false when only continuous work threshold is met', () => {
    data.primary['pay-threshold'] = 'no'
    data.primary['continuous-work'] = 'yes'

    expect(parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(false)
  })

  it('should return false when parent does not meet both pay and continuous work thresholds', () => {
    data.primary['pay-threshold'] = 'no'
    data.primary['continuous-work'] = 'no'

    expect(parentMeetsPayAndContinuousWorkThresholds(data, 'primary')).to.equal(false)
  })

  it('should return true when parent meets pay and continuous work thresholds for secondary parent', () => {
    data.secondary['pay-threshold'] = 'yes'
    data.secondary['continuous-work'] = 'yes'

    expect(parentMeetsPayAndContinuousWorkThresholds(data, 'secondary')).to.equal(true)
  })

  it('should return false when parent does not meet pay threshold for secondary parent', () => {
    data.secondary['pay-threshold'] = 'no'
    data.secondary['continuous-work'] = 'yes'

    expect(parentMeetsPayAndContinuousWorkThresholds(data, 'secondary')).to.equal(false)
  })

  it('should return true when parent does not meet continuous work threshold for secondary parent', () => {
    data.secondary['pay-threshold'] = 'yes'
    data.secondary['continuous-work'] = 'no'

    expect(parentMeetsPayAndContinuousWorkThresholds(data, 'secondary')).to.equal(false)
  })
})

describe('otherParentWorkAndPay', () => {
  let data

  beforeEach(() => {
    data = {
      primary: {
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'employment-status': 'employee',
        'work-start': 'yes'
      },
      secondary: {
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'employment-status': 'employee',
        'work-start': 'yes'
      },
      'which-parent': 'both'
    }
  })

  it('should return true when which-parent is "secondary"', () => {
    data['which-parent'] = 'secondary'
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(true)
  })

  it('should return true when which-parent is "primary"', () => {
    data['which-parent'] = 'primary'
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(true)
  })

  it('should return true when other parent is self-employed', () => {
    data.primary['employment-status'] = 'self-employed'
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(true)
  })

  it('should return true when other parent is unemployed', () => {
    data.primary['employment-status'] = 'unemployed'
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(true)
  })

  it('should return false when other parent is a worker and does not meet pay and work thresholds', () => {
    data.secondary['employment-status'] = 'worker'
    data.secondary['pay-threshold'] = 'no'
    data.secondary['continuous-work'] = 'no'
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(false)
  })

  it('should return true when other parent is a worker and does meet pay and work thresholds', () => {
    data.secondary['employment-status'] = 'worker'
    data.secondary['pay-threshold'] = 'yes'
    data.secondary['continuous-work'] = 'yes'
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(true)
  })

  it('should return true when other parent is an employee and does not meet continuous work thresholds', () => {
    data.secondary['continuous-work'] = 'no'
    data.secondary['work-start'] = 'no'
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(true)
  })

  it('should return true when other parent is an employee and does meet continuous work thresholds', () => {
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(true)
  })

  it('should return false when current parent does not have data', () => {
    data = {}
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(false)
  })

  it('should return true when current parent is an employee and does meet pay threshold', () => {
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(true)
  })

  it('should return false when current parent is an employee and does not meet pay threshold', () => {
    data.primary['pay-threshold'] = 'no'
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(true)
  })
})

describe('otherParent', () => {
  let data

  beforeEach(() => {
    data = {
      primary: {
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'employment-status': 'employee',
        'work-start': 'yes'
      },
      secondary: {
        'pay-threshold': 'yes',
        'continuous-work': 'yes',
        'employment-status': 'employee',
        'work-start': 'yes'
      },
      'which-parent': 'both'
    }
  })

  it('should set otherParent to "secondary" when parent is "primary"', () => {
    data.secondary['pay-threshold'] = 'no'
    data.secondary['employment-status'] = 'self-employed'
    expect(otherParentWorkAndPay(data, 'primary')).to.equal(false)
  })

  it('should set otherParent to "primary" when parent is "secondary"', () => {
    data.primary['pay-threshold'] = 'no'
    data.primary['employment-status'] = 'self-employed'
    expect(otherParentWorkAndPay(data, 'secondary')).to.equal(false)
  })
})
