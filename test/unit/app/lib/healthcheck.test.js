const express = require('express')
const request = require('supertest')
const { expect } = require('chai')
const { describe, it } = require('mocha')
const healthcheckRouter = require('../../../../app/lib/healthcheck')
const app = express()
app.use(healthcheckRouter)
describe('Health Check Endpoint', () => {
  describe('When the service is healthy', () => {
    it('should return a 200 status code', async () => {
      const response = await request(app).get('/pingdom/ping.xml')
      expect(response.status).to.equal(200)
    })
    it('should return correctly formed XML', async () => {
      const response = await request(app).get('/pingdom/ping.xml')
      expect(response.type).to.equal('application/xml')
      const expectedXml =
        '<?xml version="1.0" encoding="UTF-8"?><pingdom_http_custom_check><status>OK</status></pingdom_http_custom_check>'
      const actualXml = response.text.trim()
      expect(actualXml).to.equal(expectedXml)
    })
  })
})