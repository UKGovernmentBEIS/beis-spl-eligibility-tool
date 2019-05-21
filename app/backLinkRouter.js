const express = require('express')
const router = express.Router()

router.get('/:redirectBaseRoute?/:currentParent?', function (req, res) {
  req.session.data = req.query
  const { redirectBaseRoute, currentParent } = req.params
  const redirectPath = '/' + (redirectBaseRoute || '') + (currentParent ? `/${currentParent}` : '')
  res.redirect(redirectPath)
})

module.exports = router
