const { expect } = require('chai')
const { describe, it, beforeEach, afterEach } = require('mocha')
const { whichParent, employmentStatus, workAndPay, otherParentWorkAndPay } = require('../../../app/validate')
const validate = require('../../../app/validate')
const sinon = require('sinon')
const skip = require('../../../app/skip')

describe('startDate and addStartDateError', () => {
  let req
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 9)

  beforeEach(() => {
    req = {
      session: {
        data: {
          'start-date-year': '',
          'start-date-month': '',
          'start-date-day': ''
        },
        errors: []
      }
    }
  })

  afterEach(() => {
    req = {
      session: {
        data: {},
        errors: []
      }
    }
  })

  describe('startDate', () => {
    it('returns true for a valid date within the permitted range', () => {
      req.session.data['start-date-year'] = startDate.getFullYear().toString()
      req.session.data['start-date-month'] = (startDate.getMonth() + 1).toString().padStart(2, '0')
      req.session.data['start-date-day'] = startDate.getDate().toString().padStart(2, '0')

      expect(validate.startDate(req)).to.equal(true)
    })

    it('returns false and adds an error if any date part is missing', () => {
      const testCases = [
        { year: '', month: '10', day: '15', message: 'Enter a valid year' },
        {
          year: startDate.getFullYear(),
          month: '',
          day: startDate.getDate(),
          message: 'Enter a valid month'
        },
        {
          year: startDate.getFullYear(),
          month: startDate.getMonth() + 1,
          day: '',
          message: 'Enter a valid day'
        },
        {
          year: '',
          month: '',
          day: '',
          message: 'Enter a valid day, month and year'
        }
      ]

      testCases.forEach(({ year, month, day, message }) => {
        req.session.data['start-date-year'] = year
        req.session.data['start-date-month'] = month
        req.session.data['start-date-day'] = day

        expect(validate.startDate(req)).to.equal(false)
        const error = req.session.errors['start-date']

        expect(error.text).to.equal(message)
      })
    })

    it('returns false and adds an error if the date is invalid', () => {
      req.session.data['start-date-year'] = startDate.getFullYear()
      req.session.data['start-date-month'] = startDate.getMonth() + 1
      req.session.data['start-date-day'] = '41'

      expect(validate.startDate(req)).to.equal(false)
      const error = req.session.errors['start-date']
      expect(error.text).to.equal('Enter a valid day')
    })

    it('returns false and adds an error if the date is outside the permitted range', () => {
      const testCases = [
        {
          year: startDate.getFullYear() - 10,
          month: startDate.getMonth() + 1,
          day: startDate.getDate(),
          message: 'Enter a date within one year of today'
        },
        {
          year: startDate.getFullYear() + 10,
          month: startDate.getMonth() + 1,
          day: startDate.getDate(),
          message: 'Enter a date within one year of today'
        }
      ]

      testCases.forEach(({ year, month, day, message }) => {
        req.session.data['start-date-year'] = year
        req.session.data['start-date-month'] = month
        req.session.data['start-date-day'] = day

        expect(validate.startDate(req)).to.equal(false)
        const error = req.session.errors['start-date']

        expect(error.text).to.equal(message)
      })
    })
  })

  describe('addStartDateError', () => {
    const testCases = [
      {
        message: 'Test error message',
        dateParts: ['year', 'month', 'day'],
        expectedHref: '#start-date-year'
      },
      {
        message: 'Month error',
        dateParts: ['month'],
        expectedHref: '#start-date-month'
      },
      {
        message: 'Day error',
        dateParts: ['day'],
        expectedHref: '#start-date-day'
      },
      {
        message: 'No date parts error',
        dateParts: [],
        expectedHref: '#start-date-undefined'
      }
    ]

    testCases.forEach(({ message, dateParts, expectedHref }) => {
      it(`adds an error with message: "${message}"`, () => {
        validate.addStartDateError(req, message, dateParts)

        const error = req.session.errors['start-date']

        expect(error).to.have.property('text', message)
        expect(error).to.have.property('href', expectedHref)
        expect(error).to.have.property('dateParts').that.deep.equals(dateParts)
      })
    })
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
    req.session.data.primary = {}
    expect(otherParentWorkAndPay(req, 'primary')).to.equal(false)
  })
})
