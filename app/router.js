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
    res.render('employment-status', { currentParentFromUrl: req.params['current'] })
  })
  .post(function (req, res) {
    res.redirect(paths.workAndPay + `/${req.params['current']}`)
  })

router.route(paths.workAndPay + '/:current')
  .get(function (req, res) {
    res.render('work-and-pay', { currentParentFromUrl: req.params['current'] })
  })
  .post(function (req, res) {
    res.redirect(paths.partnerWorkAndPay + `/${req.params['current']}`)
  })

router.route(paths.partnerWorkAndPay + '/:current')
  .get(function (req, res) {
    res.render('partner-work-and-pay', { currentParentFromUrl: req.params['current'] })
  })
  .post(function (req, res) {
    res.redirect(paths.results)
  })

module.exports = router
