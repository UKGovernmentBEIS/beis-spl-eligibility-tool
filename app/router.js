const express = require('express')
const router = express.Router()
const paths = require('./paths')
const validate = require('./validate')

router.get('*', require('./step-validation'))

router.get(paths.getPath('root'), function (req, res) {
  res.render('index')
})

router.route(paths.getPath('birthOrAdoption'))
  .get(function (req, res) {
    res.render('birth-or-adoption')
  })
  .post(function (req, res) {
    if (!validate.birthOrAdoption(req)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.getPath('caringWithPartner'))
  })

router.route(paths.getPath('caringWithPartner'))
  .get(function (req, res) {
    res.render('caring-with-partner')
  })
  .post(function (req, res) {
    if (!validate.caringWithPartner(req)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.getPath('startDate'))
  })

router.route(paths.getPath('startDate'))
  .get(function (req, res) {
    res.render('start-date')
  })
  .post(function (req, res) {
    if (!validate.startDate(req)) {
      return res.redirect(req.url)
    }
    addRouteToSession(req, res)
    res.redirect(paths.getPath('results'))
  })

router.route(paths.getPath('results'))
  .get(function (req, res) {
    res.render('results')
  })

router.post(paths.getPath('results') + '/:current', function (req, res) {
  res.redirect(paths.getPath('employmentStatus') + `/${req.params['current']}`)
})

router.route(paths.getPath('employmentStatus') + '/:current')
  .get(function (req, res) {
    res.render('employment-status', { currentParentFromUrl: req.params['current'] })
  })
  .post(function (req, res) {
    if (!validate.employmentStatus(req)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.getPath('workAndPay') + `/${req.params['current']}`)
  })

router.route(paths.getPath('workAndPay') + '/:current')
  .get(function (req, res) {
    res.render('work-and-pay', { currentParentFromUrl: req.params['current'] })
  })
  .post(function (req, res) {
    if (!validate.workAndPay(req)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.getPath('otherParentWorkAndPay') + `/${req.params['current']}`)
  })

router.route(paths.getPath('otherParentWorkAndPay') + '/:current')
  .get(function (req, res) {
    res.render('other-parent-work-and-pay', { currentParentFromUrl: req.params['current'] })
  })
  .post(function (req, res) {
    if (!validate.otherParentWorkAndPay(req)) {
      return res.redirect(req.url)
    }
    addRouteToSession(req, res)
    res.redirect(paths.getPath('results'))
  })

module.exports = router

function addRouteToSession (req, res) {
  req.session.backPath = '/back' + req.url
}
