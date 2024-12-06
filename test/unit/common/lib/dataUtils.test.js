const { describe, it } = require('mocha')
const { expect } = require('chai')
const dataUtils = require('../../../../common/lib/dataUtils')

describe('dataUtils', () => {
  describe('feedbackExperience', () => {
    it('should return true if data is a string and matches optionName', () => {
      const result = dataUtils.feedbackExperience('testOption', 'testOption')
      expect(result).to.equal(true)
    })

    it('should return false if data is a string and does not match optionName', () => {
      const result = dataUtils.feedbackExperience('testOption', 'otherOption')
      expect(result).to.equal(false)
    })

    it('should return true if data has feedback property that matches optionName', () => {
      const result = dataUtils.feedbackExperience({ feedback: 'testOption' }, 'testOption')
      expect(result).to.equal(true)
    })

    it('should return false if data has feedback property that does not match optionName', () => {
      const result = dataUtils.feedbackExperience({ feedback: 'otherOption' }, 'testOption')
      expect(result).to.equal(false)
    })
  })
  describe('natureOfParenthood', () => {
    it('should return the nature-of-parenthood value from data', () => {
      const data = { 'nature-of-parenthood': 'birth' }
      const result = dataUtils.natureOfParenthood(data)
      expect(result).to.equal('birth')
    })
  })
  describe('typeOfAdoption', () => {
    it('should return the type-of-adoption value from data', () => {
      const data = { 'type-of-adoption': 'uk' }
      const result = dataUtils.typeOfAdoption(data)
      expect(result).to.equal('uk')
    })
  })
  describe('birthOrPlacement', () => {
    it("should return 'placement' if isAdoption", () => {
      const result = dataUtils.birthOrPlacement('adoption')
      expect(result).to.equal('placement')
    })
    it("should return 'birth' if not isAdoption", () => {
      const result = dataUtils.birthOrPlacement('birth')
      expect(result).to.equal('birth')
    })
  })
  describe('isBirth', () => {
    it('should return true if data is a string "birth"', () => {
      const result = dataUtils.isBirth('birth')
      expect(result).to.equal(true)
    })
    it('should return false if data is a string "adoption"', () => {
      const result = dataUtils.isBirth('adoption')
      expect(result).to.equal(false)
    })
    it('should return true if nature-of-parenthood in data is "birth"', () => {
      const result = dataUtils.isBirth({ 'nature-of-parenthood': 'birth' })
      expect(result).to.equal(true)
    })
    it('should return false if nature-of-parenthood in data is not "birth"', () => {
      const result = dataUtils.isBirth({ 'nature-of-parenthood': 'adoption' })
      expect(result).to.equal(false)
    })
  })
  describe('isAdoption', () => {
    it('should return true if data is a string "adoption"', () => {
      const result = dataUtils.isAdoption('adoption')
      expect(result).to.equal(true)
    })
    it('should return false if data is a string "birth"', () => {
      const result = dataUtils.isAdoption('birth')
      expect(result).to.equal(false)
    })
    it('should return true if nature-of-parenthood in data is "adoption"', () => {
      const result = dataUtils.isAdoption({
        'nature-of-parenthood': 'adoption'
      })
      expect(result).to.equal(true)
    })
    it('should return false if nature-of-parenthood in data is not "adoption"', () => {
      const result = dataUtils.isAdoption({ 'nature-of-parenthood': 'birth' })
      expect(result).to.equal(false)
    })
  })
  describe('isUkAdoption', () => {
    it('should return true for UK adoption data', () => {
      const data = {
        'nature-of-parenthood': 'adoption',
        'type-of-adoption': 'uk'
      }
      const result = dataUtils.isUkAdoption(data)
      expect(result).to.equal(true)
    })
    it('should return false for non-UK adoption data', () => {
      const data = {
        'nature-of-parenthood': 'adoption',
        'type-of-adoption': 'overseas'
      }
      const result = dataUtils.isUkAdoption(data)
      expect(result).to.equal(false)
    })
    it('should return false for birth data', () => {
      const data = {
        'nature-of-parenthood': 'birth'
      }
      const result = dataUtils.isUkAdoption(data)
      expect(result).to.equal(false)
    })
  })
  describe('isOverseasAdoption', () => {
    it('should return true for overseas adoption data', () => {
      const data = {
        'nature-of-parenthood': 'adoption',
        'type-of-adoption': 'overseas'
      }
      const result = dataUtils.isOverseasAdoption(data)
      expect(result).to.equal(true)
    })
    it('should return false for non-overseas adoption data', () => {
      const data = {
        'nature-of-parenthood': 'adoption',
        'type-of-adoption': 'uk'
      }
      const result = dataUtils.isOverseasAdoption(data)
      expect(result).to.equal(false)
    })
    it('should return false for birth data', () => {
      const data = {
        'nature-of-parenthood': 'birth'
      }
      const result = dataUtils.isOverseasAdoption(data)
      expect(result).to.equal(false)
    })
  })
  describe('isSurrogacy', () => {
    it('should return true if data is a string "surrogacy"', () => {
      const result = dataUtils.isSurrogacy('surrogacy')
      expect(result).to.equal(true)
    })
    it('should return false if data is a string "adoption"', () => {
      const result = dataUtils.isSurrogacy('adoption')
      expect(result).to.equal(false)
    })
    it('should return true if nature-of-parenthood in data is "surrogacy"', () => {
      const result = dataUtils.isSurrogacy({
        'nature-of-parenthood': 'surrogacy'
      })
      expect(result).to.equal(true)
    })
    it('should return false if nature-of-parenthood in data is not "surrogacy"', () => {
      const result = dataUtils.isSurrogacy({ 'nature-of-parenthood': 'birth' })
      expect(result).to.equal(false)
    })
  })
  describe('parentName', () => {
    it('should return "mother" for primary parent with birth data', () => {
      const result = dataUtils.parentName(
        { 'nature-of-parenthood': 'birth' },
        'primary'
      )
      expect(result).to.equal('mother')
    })
    it('should return "primary adopter" for primary parent with adoption data', () => {
      const result = dataUtils.parentName(
        { 'nature-of-parenthood': 'adoption' },
        'primary'
      )
      expect(result).to.equal('primary adopter')
    })
    it('should return "parental order parent" for non-birth or non-adoption data', () => {
      const result = dataUtils.parentName(
        { 'nature-of-parenthood': 'other' },
        'primary'
      )
      expect(result).to.equal('parental order parent')
    })
    it('should return "partner" for secondary parent', () => {
      const result = dataUtils.parentName({}, 'secondary')
      expect(result).to.equal('partner')
    })
  })
  describe('parentNameForUrl', () => {
    it('should return "mother" for primary parent with birth data', () => {
      const result = dataUtils.parentNameForUrl(
        { 'nature-of-parenthood': 'birth' },
        'primary'
      )
      expect(result).to.equal('mother')
    })
    it('should return "primary-adopter" for primary parent with adoption data', () => {
      const result = dataUtils.parentNameForUrl(
        { 'nature-of-parenthood': 'adoption' },
        'primary'
      )
      expect(result).to.equal('primary-adopter')
    })
    it('should return "parental-order-parent" for non-birth or non-adoption data', () => {
      const result = dataUtils.parentNameForUrl(
        { 'nature-of-parenthood': 'other' },
        'primary'
      )
      expect(result).to.equal('parental-order-parent')
    })
    it('should return "partner" for secondary parent', () => {
      const result = dataUtils.parentNameForUrl({}, 'secondary')
      expect(result).to.equal('partner')
    })
  })
  describe('primaryName', () => {
    it('should return "mother" for birth data', () => {
      const result = dataUtils.primaryName({ 'nature-of-parenthood': 'birth' })
      expect(result).to.equal('mother')
    })
    it('should return "primary adopter" for adoption data', () => {
      const result = dataUtils.primaryName({
        'nature-of-parenthood': 'adoption'
      })
      expect(result).to.equal('primary adopter')
    })
    it('should return "parental order parent" for other types of data', () => {
      const result = dataUtils.primaryName({ 'nature-of-parenthood': 'other' })
      expect(result).to.equal('parental order parent')
    })
  })
  describe('secondaryName', () => {
    it('should always return "partner"', () => {
      const result = dataUtils.secondaryName()
      expect(result).to.equal('partner')
    })
  })
  describe('primaryUrlName', () => {
    it('should return "mother" for birth data', () => {
      const result = dataUtils.primaryUrlName({
        'nature-of-parenthood': 'birth'
      })
      expect(result).to.equal('mother')
    })
    it('should return "primary-adopter" for adoption data', () => {
      const result = dataUtils.primaryUrlName({
        'nature-of-parenthood': 'adoption'
      })
      expect(result).to.equal('primary-adopter')
    })
    it('should return "parental-order-parent" for other types of data', () => {
      const result = dataUtils.primaryUrlName({
        'nature-of-parenthood': 'other'
      })
      expect(result).to.equal('parental-order-parent')
    })
  })
  describe('isYes', () => {
    it('should return true for "yes"', () => {
      const result = dataUtils.isYes('yes')
      expect(result).to.equal(true)
    })
    it('should return false for "no"', () => {
      const result = dataUtils.isYes('no')
      expect(result).to.equal(false)
    })
    it('should return false for other strings', () => {
      const result = dataUtils.isYes('maybe')
      expect(result).to.equal(false)
    })
  })
  describe('isNo', () => {
    it('should return true for "no"', () => {
      const result = dataUtils.isNo('no')
      expect(result).to.equal(true)
    })
    it('should return false for "yes"', () => {
      const result = dataUtils.isNo('yes')
      expect(result).to.equal(false)
    })
    it('should return false for other strings', () => {
      const result = dataUtils.isNo('maybe')
      expect(result).to.equal(false)
    })
  })
})
