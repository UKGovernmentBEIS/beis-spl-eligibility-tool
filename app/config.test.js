const { describe, it } = require('mocha')
const chai = require('chai')
const expect = chai.expect

process.env.EMAILJS_PUBLIC_KEY = 'test_public'
process.env.EMAILJS_PRIVATE_KEY = 'test_private'
process.env.EMAILJS_SERVICE_ID = 'test_service'
process.env.EMAILJS_TEMPLATE_ID = 'test_template'

const config = require('./config')

describe('config', () => {
  describe('successful configuration from config file', () => {
    it('should load the correct public key', () => {
      expect(config.publicKey).to.equal('test_public')
    })

    it('should load the correct private key', () => {
      expect(config.privateKey).to.equal('test_private')
    })

    it('should load the correct service ID', () => {
      expect(config.serviceID).to.equal('test_service')
    })

    it('should load the correct template ID', () => {
      expect(config.templateID).to.equal('test_template')
    })
  })
})
