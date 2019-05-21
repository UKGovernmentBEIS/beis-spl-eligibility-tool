const express = require('express')
const router = express.Router()
const paths = require('./paths')
const validate = require('./validate')
const qs = require('qs')

router.use(paths.back, require('./backLinkRouter'))

router.get(paths.root, function (req, res) {
  res.render('index')
})

router.route(paths.birthOrAdoption)
  .get(function (req, res) {
    const backQuery = qs.stringify(req.session.data, { addQueryPrefix: true })
    res.render('birth-or-adoption', { backQuery })
  })
  .post(function (req, res) {
    if (!validate.birthOrAdoption(req)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.caringWithPartner)
  })

router.route(paths.caringWithPartner)
  .get(function (req, res) {
    const backQuery = qs.stringify(req.session.data, { addQueryPrefix: true })
    res.render('caring-with-partner', { backQuery })
  })
  .post(function (req, res) {
    if (!validate.caringWithPartner(req)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.startDate)
  })

router.route(paths.startDate)
  .get(function (req, res) {
    const backQuery = qs.stringify(req.session.data, { addQueryPrefix: true })
    res.render('start-date', { backQuery })
  })
  .post(function (req, res) {
    if (!validate.startDate(req)) {
      return res.redirect(req.url)
    }
    addRouteToSession(req, res)
    res.redirect(paths.results)
  })

router.route(paths.results)
  .get(function (req, res) {
    const backPath = req.session.backPath
    const backQuery = qs.stringify(req.session.data, { addQueryPrefix: true })
    res.render('results', { backPath, backQuery })
  })

router.post(paths.results + '/:current', function (req, res) {
  res.redirect(paths.employmentStatus + `/${req.params['current']}`)
})

router.route(paths.employmentStatus + '/:current')
  .get(function (req, res) {
    const backQuery = qs.stringify(req.session.data, { addQueryPrefix: true })
    res.render('employment-status', { currentParentFromUrl: req.params['current'], backQuery })
  })
  .post(function (req, res) {
    if (!validate.employmentStatus(req)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.workAndPay + `/${req.params['current']}`)
  })

router.route(paths.workAndPay + '/:current')
  .get(function (req, res) {
    const backQuery = qs.stringify(req.session.data, { addQueryPrefix: true })
    res.render('work-and-pay', { currentParentFromUrl: req.params['current'], backQuery })
  })
  .post(function (req, res) {
    if (!validate.workAndPay(req)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.otherParentWorkAndPay + `/${req.params['current']}`)
  })

router.route(paths.otherParentWorkAndPay + '/:current')
  .get(function (req, res) {
    const backQuery = qs.stringify(req.session.data, { addQueryPrefix: true })
    res.render('other-parent-work-and-pay', { currentParentFromUrl: req.params['current'], backQuery })
  })
  .post(function (req, res) {
    if (!validate.otherParentWorkAndPay(req)) {
      return res.redirect(req.url)
    }
    addRouteToSession(req, res)
    res.redirect(paths.results)
  })

module.exports = router

function addRouteToSession (req, res) {
  req.session.backPath = '/back' + req.url
}
