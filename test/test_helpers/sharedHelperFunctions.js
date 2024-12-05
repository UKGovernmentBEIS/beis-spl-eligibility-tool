const { expect } = require('chai')
const { it } = require('mocha')

function createParentData (employmentStatus, payThreshold, workStart, continuousWork) {
  return {
    'employment-status': employmentStatus,
    'pay-threshold': payThreshold,
    'work-start': workStart,
    'continuous-work': continuousWork
  }
}

function runSkipTests (testCases, method, baseData) {
  testCases.forEach(({ primary, secondary, whichParent, parent, expected, message }) => {
    it(`${message}`, () => {
      const data = { ...baseData }

      if (primary) data.primary = primary
      if (secondary) data.secondary = secondary
      if (whichParent) data['which-parent'] = whichParent

      expect(method(data, parent)).to.equal(expected)
    })
  })
}

function testAcceptedValues (req, validateFunc, field, acceptedValues) {
  acceptedValues.forEach((value) => {
    req.session.data[field] = value

    expect(validateFunc(req)).to.equal(true)
  })
}

function testInvalidField (req, validateFunc, field, invalidValue, expectedError) {
  req.session.data[field] = invalidValue
  expect(validateFunc(req)).to.equal(false)

  const error = req.session.errors[field]

  expect(error.text).to.equal(expectedError.text)
  expect(error.href).to.equal(expectedError.href)
}

function addStartError (req, validateFunc, testCases) {
  testCases.forEach(({ message, dateParts, expectedHref }) => {
    it(`adds an error with message: "${message}"`, () => {
      validateFunc(req, message, dateParts)

      const error = req.session.errors['start-date']

      expect(error).to.have.property('text', message)
      expect(error).to.have.property('href', expectedHref)
      expect(error).to.have.property('dateParts').that.deep.equals(dateParts)
    })
  })
}

function employmentStatus (req, validateFunc, testCases) {
  testCases.forEach(({ employmentStatus, expected, message }) => {
    it(`${message}`, () => {
      employmentStatus.forEach((status) => {
        req.session.data.primary['employment-status'] = status
        
        expect(validateFunc(req, 'primary')).to.equal(expected)
      })
    })
  })
}

function workAndPay (req, validateFunc, testCases) {
  testCases.forEach(({ primary, secondary, whichParent, parent, expected, message }) => {
    it(`${message}`, () => {
      req.session.data.primary = primary
      req.session.data.secondary = secondary
      req.session.data['which-parent'] = whichParent

      expect(validateFunc(req, parent)).to.equal(expected)
    })
  })
}

module.exports = {
  createParentData,
  runSkipTests,
  testAcceptedValues,
  testInvalidField,
  addStartError,
  employmentStatus,
  workAndPay
}
