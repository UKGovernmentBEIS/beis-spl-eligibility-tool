const { expect } = require('chai')
const { describe, it } = require('mocha')
const validationUtils = require('../../../../app/lib/validationUtils')
const testCases = require('../../../shared/validateTestCases')

describe('validationUtils', () => {
  describe('isYesOrNo', () => {
    testCases.isYesOrNo.forEach(({ value, expected, message }) => {
      it(`${message}`, () => {
        expect(validationUtils.isYesOrNo(value)).to.equal(expected)
      })
    })
  })

  describe('prettyList', () => {
    testCases.prettyList.forEach(({ array, expected, message }) => {
      it(`${message}`, () => {
        expect(validationUtils.prettyList(array)).to.equal(expected)
      })
    })
  })

  describe('validateParentYesNoFields', () => {
    const req = {
      session: {
        data: {
          parent: {
            field1: '',
            field2: ''
          }
        }
      }
    }

    testCases.validateParentYesNoFields.forEach(({ field1, field2, expected, message }) => {
      it(`${message}`, () => {
        req.session.data.parent.field1 = field1
        req.session.data.parent.field2 = field2

        const fieldErrorMessages = {
          field1: 'Field 1 is not yes or no',
          field2: 'Field 2 is not yes or no'
        }
        expect(validationUtils.validateParentYesNoFields(req, 'parent', fieldErrorMessages)).to.equal(expected)
      })
    })
  })
})
