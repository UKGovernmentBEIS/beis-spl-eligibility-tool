const { expect } = require('chai')
const { describe, it, beforeEach, afterEach } = require('mocha')
const validate = require('../../../app/validate')
const sinon = require('sinon')
const skip = require('../../../app/skip')
const testCases = require('../../shared/validateTestCases')
const helperFunctions = require('../../test_helpers/helperFunctions')
const sharedBehaviourTests = require('../../test_helpers/sharedBehaviourTests')

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
          primary: helperFunctions.createParentData('', '', '', ''),
          secondary: helperFunctions.createParentData('', '', '', ''),
          whichParent: '',
          feedback: '',
          'spam-filter': ''
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
    it('returns true if session data contains accepted values', () => {
      const acceptedValues = ['birth', 'adoption', 'surrogacy']
      sharedBehaviourTests.testAcceptedValues(req, validate.natureOfParenthood, 'nature-of-parenthood', acceptedValues)
    })

    it("returns an error message for an invalid values in session data for 'nature-of-parenthood'", () => {
      sharedBehaviourTests.testInvalidField(req, validate.natureOfParenthood, 'nature-of-parenthood', 'test', {
        text: 'Select either birth, adoption or surrogacy',
        href: '#nature-of-parenthood'
      })
    })
  })

  describe('caringWithPartner', () => {
    it('returns true if session data contains accepted values', () => {
      const acceptedValues = ['yes', 'no']
      sharedBehaviourTests.testAcceptedValues(req, validate.caringWithPartner, 'caring-with-partner', acceptedValues)
    })

    it("returns the correct error message based on session data for 'caring-with-partner'", () => {
      const parenthoodTypes = {
        birth: 'Select whether the mother is caring for the child with a partner',
        adoption: 'Select whether the primary adopter is caring for the child with a partner',
        surrogacy: 'Select whether the parental order parent is caring for the child with a partner'
      }

      for (const [type, message] of Object.entries(parenthoodTypes)) {
        req.session.data['nature-of-parenthood'] = type
        sharedBehaviourTests.testInvalidField(req, validate.caringWithPartner, 'caring-with-partner', 'test', {
          text: message,
          href: '#caring-with-partner'
        })
      }
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
    it('returns the correct errors and error properties', () => {
      sharedBehaviourTests.addStartError(req, validate.addStartDateError, testCases.addStartDateError)
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
    it('returns correct result if session data contains accepted or invalid values', () => {
      sharedBehaviourTests.employmentStatus(req, validate.employmentStatus, testCases.employmentStatus)
    })
  })

  describe('workAndPay', () => {
    it('should return true for all valid test cases', () => {
      sharedBehaviourTests.workAndPay(req, validate.workAndPay, testCases.workAndPay)
    })
  })

  describe('otherParentWorkAndPay', () => {
    it('should return false if otherParentWorkAndPay returns false', () => {
      req.session.data.primary = {}
      req.session.data.secondary = {}

      expect(validate.otherParentWorkAndPay(req, 'primary')).to.equal(false)
    })
  })

  describe('feedback', () => {
    it('returns false and adds error if there is no feedback', () => {
      req.session.data.feedback = ''
      req.session.data['spam-filter'] = 'yes'

      validate.feedback(req)
      const error = req.session.errors.feedback
      expect(error.text).to.equal('Provide your experience with the service.')

      expect(validate.feedback(req)).to.equal(false)
    })

    testCases.feedback.forEach(({ feedback, spamFilter, url, expected, errorText, message }) => {
      it(`${message}`, () => {
        if (feedback) req.session.data.feedback = feedback
        if (spamFilter) req.session.data['spam-filter'] = spamFilter
        if (url) req.session.data.url = url

        validate.feedback(req)
        if (req.session.errors['spam-filter']) {
          const error = req.session.errors['spam-filter']
          expect(error.text).to.equal(errorText)
        }

        expect(validate.feedback(req)).to.equal(expected)
      })
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
