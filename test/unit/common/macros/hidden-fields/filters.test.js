const { describe, it } = require('mocha')
const chai = require('chai')
const expect = chai.expect
const filters = require('../../../../../common/macros/hidden-fields/filters')({})

describe('Hidden Fields Filters', function () {
  describe('castArray', function () {
    it('should cast non-array values to an array', function () {
      expect(filters.castArray('test')).to.deep.equal(['test'])
      expect(filters.castArray(123)).to.deep.equal([123])
    })

    it('should return the same array if input is already an array', function () {
      expect(filters.castArray([1, 2, 3])).to.deep.equal([1, 2, 3])
    })
  })

  describe('isObject', function () {
    it('should return true if the value is an object', function () {
      expect(filters.isObject({ key: 'value' })).to.equal(true)
    })

    it('should return false if the value is not an object', function () {
      expect(filters.isObject('string')).to.equal(false)
      expect(filters.isObject(123)).to.equal(false)
      expect(filters.isObject([1, 2, 3])).to.equal(true)
    })
  })

  describe('fieldNames', function () {
    it('should extract unique field names from a form HTML', function () {
      const formHTML = `
        <form>
          <input name="name1">
          <input name="name2">
          <textarea name="textarea1"></textarea>
          <select name="select1"></select>
        </form>
      `
      const result = filters.fieldNames(formHTML)
      expect(result).to.deep.equal(['name1', 'name2', 'textarea1', 'select1'])
    })

    it('should return normalized field names', function () {
      const formHTML = `
        <form>
          <input name="data[foo]">
          <input name="data[bar]">
        </form>
      `
      const result = filters.fieldNames(formHTML)
      expect(result).to.deep.equal(['data[foo]', 'data[bar]'])
    })
  })

  describe('matchesAnyField', function () {
    it('should return true if the field name matches any in the list (case insensitive)', function () {
      const fieldsToMatch = ['name1', 'name2', 'name3']
      expect(filters.matchesAnyField('name1', fieldsToMatch)).to.equal('name1')
      expect(filters.matchesAnyField('NAME2', fieldsToMatch)).to.equal('name2')
    })

    it('should return undefined if the field name does not match any in the list', function () {
      const fieldsToMatch = ['name1', 'name2', 'name3']
      expect(filters.matchesAnyField('name4', fieldsToMatch)).to.equal(undefined)
    })
  })

  describe('normalisedFieldName', function () {
    it('should normalize field names by removing extra query string parameters and trailing "="', function () {
      const result = filters.matchesAnyField('data[foo]=', ['data[foo]', 'data[bar]'])
      expect(result).to.equal('data[foo]')
    })

    it('should handle complex field names', function () {
      const result = filters.matchesAnyField('data[foo][bar]=', ['data[foo][bar]', 'data[bar]'])
      expect(result).to.equal('data[foo][bar]')
    })
  })
})
