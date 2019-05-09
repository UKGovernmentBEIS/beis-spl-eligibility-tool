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
    Object.assign(req.session.data, req.body)
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
    Object.assign(req.session.data, req.body)
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
    Object.assign(req.session.data, req.body)
    res.redirect(paths.results)
  })

router.route(paths.results)
  .get(function (req, res) {
    res.render('results')
  })

module.exports = router
