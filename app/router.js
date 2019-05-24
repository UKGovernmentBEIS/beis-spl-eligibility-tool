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
    res.redirect(paths.getPath('results'))
  })

router.route(paths.getPath('results'))
  .get(function (req, res) {
    res.render('results')
  })

router.post(paths.getPath('results') + '/:current', function (req, res) {
  res.redirect(paths.getPath(`employmentStatus.${req.params.current}`))
})

router.route(paths.getPath('employmentStatus.mother'))
  .get(employmentStatusGet.bind(this, 'mother'))
  .post(employmentStatusPost.bind(this, 'mother'))

router.route(paths.getPath('employmentStatus.primary-adopter'))
  .get(employmentStatusGet.bind(this, 'primary-adopter'))
  .post(employmentStatusPost.bind(this, 'primary-adopter'))

router.route(paths.getPath('employmentStatus.partner'))
  .get(employmentStatusGet.bind(this, 'partner'))
  .post(employmentStatusPost.bind(this, 'partner'))

function employmentStatusGet (parent, req, res) {
  res.render('employment-status', { currentParentFromUrl: parent })
}

function employmentStatusPost (parent, req, res) {
  if (!validate.employmentStatus(req, parent)) {
    return res.redirect(req.url)
  }
  res.redirect(paths.getPath(`workAndPay.${parent}`))
}

router.route(paths.getPath('workAndPay.mother'))
  .get(workAndPayGet.bind(this, 'mother'))
  .post(workAndPayPost.bind(this, 'mother'))

router.route(paths.getPath('workAndPay.primary-adopter'))
  .get(workAndPayGet.bind(this, 'primar-adopter'))
  .post(workAndPayPost.bind(this, 'primar-adopter'))

router.route(paths.getPath('workAndPay.partner'))
  .get(workAndPayGet.bind(this, 'partner'))
  .post(workAndPayPost.bind(this, 'partner'))

function workAndPayGet (parent, req, res) {
  res.render('work-and-pay', { currentParentFromUrl: parent })
}

function workAndPayPost (parent, req, res) {
  if (!validate.workAndPay(req, parent)) {
    return res.redirect(req.url)
  }
  res.redirect(paths.getPath(`otherParentWorkAndPay.${parent}`))
}

router.route(paths.getPath('otherParentWorkAndPay.mother'))
  .get(otherParentWorkAndPayGet.bind(this, 'mother'))
  .post(otherParentWorkAndPayPost.bind(this, 'mother'))

router.route(paths.getPath('otherParentWorkAndPay.primary-adopter'))
  .get(otherParentWorkAndPayGet.bind(this, 'primar-adopter'))
  .post(otherParentWorkAndPayPost.bind(this, 'primar-adopter'))

router.route(paths.getPath('otherParentWorkAndPay.partner'))
  .get(otherParentWorkAndPayGet.bind(this, 'partner'))
  .post(otherParentWorkAndPayPost.bind(this, 'partner'))

function otherParentWorkAndPayGet (parent, req, res) {
  res.render('other-parent-work-and-pay', { currentParentFromUrl: parent })
}

function otherParentWorkAndPayPost (parent, req, res) {
  if (!validate.otherParentWorkAndPay(req, parent)) {
    return res.redirect(req.url)
  }

  res.redirect(paths.getPath('results'))
}

module.exports = router
