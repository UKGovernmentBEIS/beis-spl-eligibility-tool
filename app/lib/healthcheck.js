const express = require('express')
const router = express.Router()
const xml = require('xml')
router.get('/pingdom/ping.xml', (req, res) => {
  const healthStatus = {
    app: { success: true }
  }
  const isHealthy = Object.values(healthStatus).every((check) => check.success)
  const status = isHealthy ? 'OK' : 'FAIL'
  const response = xml([{ pingdom_http_custom_check: [{ status }] }], {
    declaration: true
  })
  console.info(`Healthcheck status: ${status}`)
  res.type('application/xml')
  res.status(isHealthy ? 200 : 500).send(response)
})
module.exports = router
