const express = require('express')
const router = new express.Router()
const paths = require('./paths')
const validate = require('./validate')

router.get(paths.root, function (req, res) {
  res.render('index')
})

router.route(paths.birthOrAdoption)
  .get(function (req, res) {
    res.render('birth-or-adoption')
  })
  .post(function (req, res) {
    if (!validate.birthOrAdoption(req)) {
      return res.redirect(paths.birthOrAdoption)
    }
    req.session.data['birth-or-adoption'] = req.body['birth-or-adoption']
    res.redirect(paths.caringWithPartner)
  })

router.route(paths.caringWithPartner)
  .get(function (req, res) {
    res.render('caring-with-partner')
  })
  .post(function (req, res) {
    if (!validate.caringWithPartner(req)) {
      return res.redirect(paths.caringWithPartner)
    }
    req.session.data['caring-with-partner'] = req.body['caring-with-partner']
    res.redirect(paths.startDate)
  })

router.route(paths.startDate)
  .get(function (req, res) {
    res.render('start-date')
  })
  .post(function (req, res) {
    if (!validate.startDate(req)) {
      return res.redirect(paths.startDate)
    }
    ['start-date-year', 'start-date-month', 'start-date-day'].forEach(key => { req.session.data[key] = req.body[key] })
    res.redirect(paths.results)
  })

router.route(paths.results)
  .get(function (req, res) {
    res.render('results')
  })

router.post(paths.results + '/:current', function (req, res) {
  res.redirect(paths.employmentStatus + `/${req.params['current']}`)
})

router.route(paths.employmentStatus + '/:current')
  .get(function (req, res) {
    res.render('employment-status', { currentParent: req.params['current'] })
  })
  .post(function (req, res) {
    res.redirect(paths.workAndPay + `/${req.params['current']}`)
  })

router.route(paths.workAndPay + '/:current')
  .get(function (req, res) {
    res.render('work-and-pay', { currentParent: req.params['current'] })
  })

module.exports = router
