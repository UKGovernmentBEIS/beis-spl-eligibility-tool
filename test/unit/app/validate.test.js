const { expect } = require('chai')
const { describe, it, beforeEach, afterEach } = require('mocha')
const validate = require('../../../app/validate')
const sinon = require('sinon')
const skip = require('../../../app/skip')

describe('validate.js', () => {
  let req
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 9)

  beforeEach(() => {
    req = {
      session: {
        data: {
          'nature-of-parenthood': '',
          'start-date-year': '',
          'start-date-month': '',
          'start-date-day': '',
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

  describe('natureOfParenthood', () => {
    it("returns true if request session data 'nature-of-parenthood' contains accepted values", () => {
      const acceptedValues = ['birth', 'adoption', 'surrogacy']

      acceptedValues.forEach((value) => {
        req.session.data['nature-of-parenthood'] = value
        expect(validate.natureOfParenthood(req)).to.equal(true)
      })
    })

    it("returns an error message and false if request session data 'nature-of-parenthood' does not contain accepted values", () => {
      req.session.data['nature-of-parenthood'] = 'test'
      expect(validate.natureOfParenthood(req)).to.equal(false)

      const error = req.session.errors['nature-of-parenthood']

      expect(error.text).to.equal('Select either birth, adoption or surrogacy')
      expect(error.href).to.equal('#nature-of-parenthood')
    })
  })

  describe('caringWithPartner', () => {
    it("returns true if request session data 'caring-with-partner' contains accepted values", () => {
      const acceptedValues = ['yes', 'no']

      acceptedValues.forEach((value) => {
        req.session.data['caring-with-partner'] = value
        expect(validate.caringWithPartner(req)).to.equal(true)
      })
    })

    it("returns an error message and false if request session data 'caring-with-partner' does not contain accepted values", () => {
      req.session.data['caring-with-partner'] = 'test'
      expect(validate.caringWithPartner(req)).to.equal(false)

      const error = req.session.errors['caring-with-partner']

      expect(error.text).to.equal('Select whether or not you are caring for the child with a partner')
      expect(error.href).to.equal('#caring-with-partner')
    })
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
        message: 'Day Error',
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

    it('should add an error if there is an invalid day inputted', () => {
      req.session.data['start-date-year'] = startDate.getFullYear().toString()
      req.session.data['start-date-month'] = (startDate.getMonth() + 1).toString().padStart(2, '0')
      req.session.data['start-date-day'] = '43'
      expect(validate.startDate(req)).to.equal(false)
      const error = req.session.errors['start-date']
      expect(error).to.have.property('text', 'Enter a valid day')
      expect(error).to.have.property('href', '#start-date-day')
      expect(error).to.have.property('dateParts').that.deep.equals(['day'])
    })

    it('should add an error if there is invalid month inputted', () => {
      req.session.data['start-date-year'] = startDate.getFullYear().toString()
      req.session.data['start-date-month'] = '20'
      req.session.data['start-date-day'] = startDate.getDate().toString().padStart(2, '0')
      expect(validate.startDate(req)).to.equal(false)
      const error = req.session.errors['start-date']
      expect(error).to.have.property('text', 'Enter a valid month')
      expect(error).to.have.property('href', '#start-date-month')
      expect(error).to.have.property('dateParts').that.deep.equals(['month'])
    })

    it('should add an error if there is invalid year inputted', () => {
      req.session.data['start-date-year'] = '2000'
      req.session.data['start-date-month'] = (startDate.getMonth() + 1).toString().padStart(2, '0')
      req.session.data['start-date-day'] = startDate.getDate().toString().padStart(2, '0')
      expect(validate.startDate(req)).to.equal(false)
      const error = req.session.errors['start-date']
      expect(error).to.have.property('text', 'Enter a date within one year of today')
      expect(error).to.have.property('href', '#start-date-day')
      expect(error).to.have.property('dateParts').that.deep.equals(['day', 'month', 'year'])
    })

    it('should add an error if there are non-integers in the input date fields', () => {
      req.session.data['start-date-day'] = 'A'
      req.session.data['start-date-month'] = 'B'
      req.session.data['start-date-year'] = 'C'
      expect(validate.startDate(req)).to.equal(false)
      const error = req.session.errors['start-date']
      expect(error).to.have.property('text', 'Enter a valid date')
      expect(error).to.have.property('href', '#start-date-day')
      expect(error).to.have.property('dateParts').that.deep.equals(['day', 'month', 'year'])
    })
  })

  describe('whichParent', () => {
    it('should return true when whichParent has a valid value', () => {
      req.session.data['which-parent'] = 'primary'
      expect(validate.whichParent(req)).to.equal(true)
    })

    it('should return false when whichParent has an invalid value', () => {
      req.session.data['which-parent'] = 'invalid'
      expect(validate.whichParent(req)).to.equal(false)
    })

    it('should return false when whichParent is an empty string', () => {
      req.session.data['which-parent'] = ''
      expect(validate.whichParent(req)).to.equal(false)
    })

    it('should return false when whichParent is null', () => {
      req.session.data['which-parent'] = null
      expect(validate.whichParent(req)).to.equal(false)
    })
  })

  describe('employmentStatus', () => {
    it('should return true when employmentStatus returns true', () => {
      sinon.stub(skip, 'employmentStatus').returns(true)
      const result = validate.employmentStatus(req, 'primary')
      expect(result).to.equal(true)
      skip.employmentStatus.restore()
    })

    it('should return true when primary employmentStatus is "employee"', () => {
      req.session.data.primary['employment-status'] = 'employee'
      const result = validate.employmentStatus(req, 'primary')
      expect(result).to.equal(true)
    })

    it('should return true when secondary employmentStatus is "worker"', () => {
      req.session.data.secondary['employment-status'] = 'worker'
      const result = validate.employmentStatus(req, 'secondary')
      expect(result).to.equal(true)
    })

    it('should return true when primary employmentStatus is "self-employed"', () => {
      req.session.data.primary['employment-status'] = 'self-employed'
      const result = validate.employmentStatus(req, 'primary')
      expect(result).to.equal(true)
    })

    it('should return true when secondary employmentStatus is "unemployed"', () => {
      req.session.data.secondary['employment-status'] = 'unemployed'
      const result = validate.employmentStatus(req, 'secondary')
      expect(result).to.equal(true)
    })

    it('should return false when employmentStatus is invalid', () => {
      req.session.data.primary['employment-status'] = 'invalid'
      const result = validate.employmentStatus(req, 'primary')
      expect(result).to.equal(false)
    })

    it('should return false when employmentStatus is empty', () => {
      req.session.data.primary['employment-status'] = ''
      const result = validate.employmentStatus(req, 'primary')
      expect(result).to.equal(false)
    })

    it('should return false when employmentStatus is null', () => {
      req.session.data.primary['employment-status'] = null
      const result = validate.employmentStatus(req, 'primary')
      expect(result).to.equal(false)
    })
  })

  describe('workAndPay', () => {
    it('should return true when workAndPay returns true', () => {
      sinon.stub(skip, 'workAndPay').returns(true)
      expect(validate.workAndPay(req, 'primary')).to.equal(true)
      skip.workAndPay.restore()
    })

    it('should return "secondary" for which-parent when parent is primary', () => {
      req.session.data.whichParent = 'secondary'
      expect(validate.workAndPay(req, 'primary')).to.equal(true)
    })

    it('should return "primary" for which-parent when parent is secondary', () => {
      req.session.data.whichParent = 'primary'
      expect(validate.workAndPay(req, 'secondary')).to.equal(true)
    })

    it('should return true when employmentStatus is "self-employed" for primary', () => {
      req.session.data.primary['employment-status'] = 'self-employed'
      expect(validate.workAndPay(req, 'primary')).to.equal(true)
    })

    it('should return true when employmentStatus is "self-employed" for primary', () => {
      req.session.data.primary['employment-status'] = 'unemployed'
      expect(validate.workAndPay(req, 'primary')).to.equal(true)
    })

    it('should return true when employmentStatus is "self-employed" for secondary', () => {
      req.session.data.secondary['employment-status'] = 'self-employed'
      expect(validate.workAndPay(req, 'secondary')).to.equal(true)
    })

    it('should return true when employmentStatus is "self-employed" for secondary', () => {
      req.session.data.secondary['employment-status'] = 'unemployed'
      expect(validate.workAndPay(req, 'secondary')).to.equal(true)
    })
  })

  describe('otherParentWorkAndPay', () => {
    it('should return true if otherParentWorkAndPay returns true', () => {
      sinon.stub(skip, 'otherParentWorkAndPay').returns(true)
      expect(validate.otherParentWorkAndPay(req, 'primary')).to.equal(true)
      skip.otherParentWorkAndPay.restore()
    })

    it('should return false if otherParentWorkAndPay returns false', () => {
      req.session.data.primary = {}
      req.session.data.secondary = {}
      expect(validate.otherParentWorkAndPay(req, 'primary')).to.equal(false)
    })
  })
})
