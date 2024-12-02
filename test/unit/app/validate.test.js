const { expect } = require('chai')
const { describe, it, beforeEach } = require('mocha')
const { whichParent, employmentStatus, workAndPay, otherParentWorkAndPay, startDate } = require('../../../app/validate')
const sinon = require('sinon')
const skip = require('../../../app/skip')

describe('startDate', () => {
  let req
  const currentDate = new Date()

  beforeEach(() => {
    req = {
      session: {
        data: {
          'start-date-year': '',
          'start-date-month': '',
          'start-date-day': ''
        }
      }
    }
  })

  it('should return true if the date is valid', () => {
    const pastDate = new Date(currentDate.setMonth(currentDate.getMonth() - 2))
    req.session.data['start-date-year'] = pastDate.getFullYear().toString()
    req.session.data['start-date-month'] = (pastDate.getMonth() + 1).toString().padStart(2, '0')
    req.session.data['start-date-day'] = pastDate.getDate().toString().padStart(2, '0')

    expect(startDate(req)).to.equal(true)
  })

  it('should return false if there are missing data values', () => {
    req.session.data['start-date-month'] = '10'
    req.session.data['start-date-day'] = '20'

    expect(startDate(req)).to.equal(false)
  })

  it('should return false if the date values are not valid', () => {
    const pastDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 3))
    req.session.data['start-date-year'] = pastDate.getFullYear().toString()
    req.session.data['start-date-month'] = (pastDate.getMonth() + 1).toString().padStart(2, '0')
    req.session.data['start-date-day'] = pastDate.getDate().toString().padStart(2, '0')

    expect(startDate(req)).to.equal(false)
  })
})

describe('whichParent', () => {
  let req

  beforeEach(() => {
    req = {
      session: {
        data: {
          primary: {
            'pay-threshold': 'yes',
            'continuous-work': 'yes',
            'employment-status': 'employee',
            'work-start': 'yes'
          },
          secondary: {}
        }
      }
    }
  })

  it('should return true when whichParent has a valid value', () => {
    req.session.data['which-parent'] = 'primary'
    expect(whichParent(req)).to.equal(true)
  })

  it('should return false when whichParent has an invalid value', () => {
    req.session.data['which-parent'] = 'invalid'
    expect(whichParent(req)).to.equal(false)
  })

  it('should return false when whichParent is an empty string', () => {
    req.session.data['which-parent'] = ''
    expect(whichParent(req)).to.equal(false)
  })

  it('should return false when whichParent is null', () => {
    req.session.data['which-parent'] = null
    expect(whichParent(req)).to.equal(false)
  })
})

describe('employmentStatus', () => {
  let req

  beforeEach(() => {
    req = {
      session: {
        data: {
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
      }
    }
  })

  it('should return true when employmentStatus returns true', () => {
    sinon.stub(skip, 'employmentStatus').returns(true)
    const result = employmentStatus(req, 'primary')
    expect(result).to.equal(true)
    skip.employmentStatus.restore()
  })

  it('should return true when primary employmentStatus is "employee"', () => {
    req.session.data.primary['employment-status'] = 'employee'
    const result = employmentStatus(req, 'primary')
    expect(result).to.equal(true)
  })

  it('should return true when secondary employmentStatus is "worker"', () => {
    req.session.data.secondary['employment-status'] = 'worker'
    const result = employmentStatus(req, 'secondary')
    expect(result).to.equal(true)
  })

  it('should return true when primary employmentStatus is "self-employed"', () => {
    req.session.data.primary['employment-status'] = 'self-employed'
    const result = employmentStatus(req, 'primary')
    expect(result).to.equal(true)
  })

  it('should return true when secondary employmentStatus is "unemployed"', () => {
    req.session.data.secondary['employment-status'] = 'unemployed'
    const result = employmentStatus(req, 'secondary')
    expect(result).to.equal(true)
  })

  it('should return false when employmentStatus is invalid', () => {
    req.session.data.primary['employment-status'] = 'invalid'
    const result = employmentStatus(req, 'primary')
    expect(result).to.equal(false)
  })

  it('should return false when employmentStatus is empty', () => {
    req.session.data.primary['employment-status'] = ''
    const result = employmentStatus(req, 'primary')
    expect(result).to.equal(false)
  })

  it('should return false when employmentStatus is null', () => {
    req.session.data.primary['employment-status'] = null
    const result = employmentStatus(req, 'primary')
    expect(result).to.equal(false)
  })
})

describe('workAndPay', () => {
  let req

  beforeEach(() => {
    req = {
      session: {
        data: {
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
          whichParent: 'both'
        }
      }
    }
  })

  it('should return true when workAndPay returns true', () => {
    sinon.stub(skip, 'workAndPay').returns(true)
    expect(workAndPay(req, 'primary')).to.equal(true)
    skip.workAndPay.restore()
  })

  it('should return "secondary" for which-parent when parent is primary', () => {
    req.session.data.whichParent = 'secondary'
    expect(workAndPay(req, 'primary')).to.equal(true)
  })

  it('should return "primary" for which-parent when parent is secondary', () => {
    req.session.data.whichParent = 'primary'
    expect(workAndPay(req, 'secondary')).to.equal(true)
  })

  it('should return true when employmentStatus is "self-employed" for primary', () => {
    req.session.data.primary['employment-status'] = 'self-employed'
    expect(workAndPay(req, 'primary')).to.equal(true)
  })

  it('should return true when employmentStatus is "self-employed" for primary', () => {
    req.session.data.primary['employment-status'] = 'unemployed'
    expect(workAndPay(req, 'primary')).to.equal(true)
  })

  it('should return true when employmentStatus is "self-employed" for secondary', () => {
    req.session.data.secondary['employment-status'] = 'self-employed'
    expect(workAndPay(req, 'secondary')).to.equal(true)
  })

  it('should return true when employmentStatus is "self-employed" for secondary', () => {
    req.session.data.secondary['employment-status'] = 'unemployed'
    expect(workAndPay(req, 'secondary')).to.equal(true)
  })
})

describe('otherParentWorkAndPay', () => {
  let req

  beforeEach(() => {
    req = {
      session: {
        data: {
          primary: {
            'pay-threshold': 'yes',
            'continuous-work': 'yes',
            'employment-status': 'employee',
            'work-start': 'yes'
          },
          secondary: {}
        }
      }
    }
  })

  it('should return true if otherParentWorkAndPay returns true', () => {
    sinon.stub(skip, 'otherParentWorkAndPay').returns(true)
    expect(otherParentWorkAndPay(req, 'primary')).to.equal(true)
    skip.otherParentWorkAndPay.restore()
  })

  it('should return false if otherParentWorkAndPay returns false', () => {
    req.session.data.primary['pay-threshold'] = ''
    req.session.data.primary['continuous-work'] = ''
    req.session.data.primary['employment-status'] = ''
    req.session.data.primary['work-start'] = ''
    expect(otherParentWorkAndPay(req, 'primary')).to.equal(false)
  })
})
