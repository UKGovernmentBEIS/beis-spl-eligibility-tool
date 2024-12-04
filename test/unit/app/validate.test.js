const { expect } = require('chai')
const { describe, it, beforeEach, afterEach } = require('mocha')
const validate = require('../../../app/validate')
const sinon = require('sinon')
const skip = require('../../../app/skip')
const createParentData = require('../../test_helpers/createParentData')

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
          primary: createParentData('', '', '', ''),
          secondary: createParentData('', '', '', ''),
          whichParent: ''
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
    const testCases = [
      {
        year: startDate.getFullYear() - 10,
        month: startDate.getMonth() + 1,
        day: startDate.getDate(),
        message: 'returns false and adds an error if the year is more than one year before today',
        errorText: 'Enter a date within one year of today'
      },
      {
        year: startDate.getFullYear() + 10,
        month: startDate.getMonth() + 1,
        day: startDate.getDate(),
        message: 'returns false and adds an error if the year is more than one year after today',
        errorText: 'Enter a date within one year of today'
      },
      {
        year: '',
        month: '10',
        day: '15',
        message: 'returns false and adds an error if the year part is missing',
        errorText: 'Enter a valid year'
      },
      {
        year: startDate.getFullYear(),
        month: '',
        day: startDate.getDate(),
        message: 'returns false and adds an error if the month part is missing',
        errorText: 'Enter a valid month'
      },
      {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        day: '',
        message: 'returns false and adds an error if any day part is missing',
        errorText: 'Enter a valid day'
      },
      {
        year: '',
        month: '',
        day: '',
        message: 'returns false and adds an error if all date parts are missing',
        errorText: 'Enter a valid day, month and year'
      },
      {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        day: '41',
        message: 'returns false and adds an error if the day is invalid',
        errorText: 'Enter a valid day'
      },
      {
        year: startDate.getFullYear(),
        month: '20',
        day: startDate.getDate(),
        message: 'returns false and adds an error if the month is invalid',
        errorText: 'Enter a valid month'
      },
      {
        year: 'C',
        month: 'B',
        day: 'C',
        message: 'returns false and adds an error if non-integers have been inputted',
        errorText: 'Enter a valid date'
      }
    ]

    testCases.forEach(({ year, month, day, message, errorText }) => {
      it(`${message}`, () => {
        req.session.data['start-date-year'] = year
        req.session.data['start-date-month'] = month
        req.session.data['start-date-day'] = day

        expect(validate.startDate(req)).to.equal(false)
        const error = req.session.errors['start-date']

        expect(error.text).to.equal(errorText)
      })
    })

    it('returns true for a valid date within the permitted range', () => {
      req.session.data['start-date-year'] = startDate.getFullYear().toString()
      req.session.data['start-date-month'] = (startDate.getMonth() + 1).toString().padStart(2, '0')
      req.session.data['start-date-day'] = startDate.getDate().toString().padStart(2, '0')

      expect(validate.startDate(req)).to.equal(true)
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

  describe('whichParent', () => {
    const testCases = [
      {
        whichParent: 'primary',
        expected: true,
        message: 'returns true for whichParent is primary'
      },
      {
        whichParent: 'secondary',
        expected: true,
        message: 'returns true for whichParent is secondary'
      },
      {
        whichParent: 'invalid',
        expected: false,
        message: 'returns false for whichParent is invalid'
      },
      {
        whichParent: '',
        expected: false,
        message: 'returns false for whichParent is an empty string'
      },
      {
        whichParent: null,
        expected: false,
        message: 'returns false for whichParent is null'
      }
    ]

    testCases.forEach(({ whichParent, expected, message }) => {
      it(`${message}`, () => {
        req.session.data['which-parent'] = whichParent

        expect(validate.whichParent(req)).to.equal(expected)
      })
    })
  })

  describe('employmentStatus', () => {
    const testCases = [
      {
        employmentStatus: ['employee', 'worker', 'self-employed', 'unemployed'],
        expected: true,
        message: 'should returns true for valid employmentStatus'
      },
      {
        employmentStatus: ['invalid', '', null],
        expected: false,
        message: 'should return false for invalid employmentStatus'
      }
    ]

    testCases.forEach(({ employmentStatus, expected, message }) => {
      it(`${message}`, () => {
        employmentStatus.forEach((status) => {
          req.session.data.primary['employment-status'] = status
          expect(validate.employmentStatus(req, 'primary')).to.equal(expected)
        })
      })
    })
  })

  describe('workAndPay', () => {
    const testCases = [
      {
        primary: createParentData('employee', 'yes', 'yes', 'yes'),
        secondary: createParentData('employee', 'yes', 'yes', 'yes'),
        whichParent: 'secondary',
        parent: 'primary',
        expected: true,
        message: 'should return true when which-parent is "secondary" and parent is "primary"'
      },
      {
        primary: createParentData('employee', 'yes', 'yes', 'yes'),
        secondary: createParentData('employee', 'yes', 'yes', 'yes'),
        whichParent: 'primary',
        parent: 'secondary',
        expected: true,
        message: 'should return true when which-parent is "primary" and parent is "secondary"'
      },
      {
        primary: createParentData('self-employed', '', '', ''),
        parent: 'primary',
        expected: true,
        message: 'should return true when employmentStatus is "self-employed" and parent is "primary"'
      },
      {
        secondary: createParentData('self-employed', '', '', ''),
        parent: 'secondary',
        expected: true,
        message: 'should return true when employmentStatus is "self-employed" and parent is "secondary"'
      }
    ]

    testCases.forEach(({ primary, secondary, whichParent, parent, expected, message }) => {
      it(`${message}`, () => {
        if (primary) req.session.data.primary = primary
        if (secondary) req.session.data.secondary = secondary
        if (whichParent) req.session.data['which-parent'] = whichParent

        expect(validate.workAndPay(req, parent)).to.equal(expected)
      })
    })
  })

  describe('otherParentWorkAndPay', () => {
    it('should return false if otherParentWorkAndPay returns false', () => {
      req.session.data.primary = {}
      req.session.data.secondary = {}

      expect(validate.otherParentWorkAndPay(req, 'primary')).to.equal(false)
    })
  })

  describe('sinon.stub tests', () => {
    const testCases = [
      {
        primary: createParentData('employee', 'yes', 'yes', 'yes'),
        function: 'employmentStatus',
        expected: true,
        message: 'should return true for employmentStatus'
      },
      {
        primary: createParentData('employee', 'yes', 'yes', 'yes'),
        function: 'workAndPay',
        expected: true,
        message: 'should return true for workAndPay'
      },
      {
        primary: createParentData('employee', 'yes', 'yes', 'yes'),
        function: 'otherParentWorkAndPay',
        expected: true,
        message: 'should return true for otherParentWorkAndPay'
      }
    ]

    testCases.forEach(({ primary, function: func, expected, message }) => {
      it(`${message}`, () => {
        req.session.data.primary = primary
        sinon.stub(skip, func).returns(true)

        expect(validate[func](req, 'primary')).to.equal(expected)

        skip[func].restore()
      })
    })
  })
})
