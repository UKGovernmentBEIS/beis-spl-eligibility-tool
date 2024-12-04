const { expect } = require('chai')
const { describe, it, beforeEach, afterEach } = require('mocha')
const validate = require('../../../app/validate')
const sinon = require('sinon')
const skip = require('../../../app/skip')
const createParentData = require('../../test_helpers/createParentData')
const testCases = require('../../shared/validateTestCases')

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
    testCases.startDateCases.forEach(({ year, month, day, message, errorText }) => {
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
    testCases.addStartDateError.forEach(({ message, dateParts, expectedHref }) => {
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
    testCases.whichParent.forEach(({ whichParent, expected, message }) => {
      it(`${message}`, () => {
        req.session.data['which-parent'] = whichParent

        expect(validate.whichParent(req)).to.equal(expected)
      })
    })
  })

  describe('employmentStatus', () => {
    testCases.employmentStatus.forEach(({ employmentStatus, expected, message }) => {
      it(`${message}`, () => {
        employmentStatus.forEach((status) => {
          req.session.data.primary['employment-status'] = status
          expect(validate.employmentStatus(req, 'primary')).to.equal(expected)
        })
      })
    })
  })

  describe('workAndPay', () => {
    testCases.workAndPay.forEach(({ primary, secondary, whichParent, parent, expected, message }) => {
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
    testCases.sinonStubs.forEach(({ primary, function: func, expected, message }) => {
      it(`${message}`, () => {
        req.session.data.primary = primary
        sinon.stub(skip, func).returns(true)

        expect(validate[func](req, 'primary')).to.equal(expected)

        skip[func].restore()
      })
    })
  })
})
