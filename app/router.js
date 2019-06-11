const express = require('express')
const router = express.Router()
const paths = require('./paths')
const validate = require('./validate')

router.get(paths.getPath('root'), function (req, res) {
  res.render('index')
})

router.route(paths.getPath('birthOrAdoption'))
  .get(function (req, res) {
    res.render('birth-or-adoption')
  })
  .post(function (req, res) {
    if (!validate.birthOrAdoption(req)) {
      return res.redirect('back')
    }
    res.redirect(paths.getPath('caringWithPartner'))
  })

router.route(paths.getPath('caringWithPartner'))
  .get(function (req, res) {
    res.render('caring-with-partner')
  })
  .post(function (req, res) {
    if (!validate.caringWithPartner(req)) {
      return res.redirect('back')
    }
    res.redirect(paths.getPath('startDate'))
  })

router.route(paths.getPath('startDate'))
  .get(function (req, res) {
    res.render('start-date')
  })
  .post(function (req, res) {
    if (!validate.startDate(req)) {
      return res.redirect('back')
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

function employmentStatusGet (parentUrlPart, req, res) {
  const currentParent = getParent(parentUrlPart)
  res.render('employment-status', { currentParent })
}

function employmentStatusPost (parentUrlPart, req, res) {
  const currentParent = getParent(parentUrlPart)
  if (!validate.employmentStatus(req, currentParent)) {
    return res.redirect('back')
  }
  res.redirect(paths.getPath(`workAndPay.${parentUrlPart}`))
}

router.route(paths.getPath('employmentStatus.mother'))
  .get(employmentStatusGet.bind(this, 'mother'))
  .post(employmentStatusPost.bind(this, 'mother'))

router.route(paths.getPath('employmentStatus.primary-adopter'))
  .get(employmentStatusGet.bind(this, 'primary-adopter'))
  .post(employmentStatusPost.bind(this, 'primary-adopter'))

router.route(paths.getPath('employmentStatus.partner'))
  .get(employmentStatusGet.bind(this, 'partner'))
  .post(employmentStatusPost.bind(this, 'partner'))

function workAndPayGet (parentUrlPart, req, res) {
  const currentParent = getParent(parentUrlPart)
  res.render('work-and-pay', { currentParent })
}

function workAndPayPost (parentUrlPart, req, res) {
  const currentParent = getParent(parentUrlPart)
  if (!validate.workAndPay(req, currentParent)) {
    return res.redirect('back')
  }
  res.redirect(paths.getPath(`otherParentWorkAndPay.${parentUrlPart}`))
}

router.route(paths.getPath('workAndPay.mother'))
  .get(workAndPayGet.bind(this, 'mother'))
  .post(workAndPayPost.bind(this, 'mother'))

router.route(paths.getPath('workAndPay.primary-adopter'))
  .get(workAndPayGet.bind(this, 'primary-adopter'))
  .post(workAndPayPost.bind(this, 'primary-adopter'))

router.route(paths.getPath('workAndPay.partner'))
  .get(workAndPayGet.bind(this, 'partner'))
  .post(workAndPayPost.bind(this, 'partner'))

function otherParentWorkAndPayGet (parentUrlPart, req, res) {
  const currentParent = getParent(parentUrlPart)
  res.render('other-parent-work-and-pay', { currentParent })
}

function otherParentWorkAndPayPost (parentUrlPart, req, res) {
  const currentParent = getParent(parentUrlPart)
  if (!validate.otherParentWorkAndPay(req, currentParent)) {
    return res.redirect('back')
  }
  res.redirect(paths.getPath('results'))
}

router.route(paths.getPath('otherParentWorkAndPay.mother'))
  .get(otherParentWorkAndPayGet.bind(this, 'mother'))
  .post(otherParentWorkAndPayPost.bind(this, 'mother'))

router.route(paths.getPath('otherParentWorkAndPay.primary-adopter'))
  .get(otherParentWorkAndPayGet.bind(this, 'primary-adopter'))
  .post(otherParentWorkAndPayPost.bind(this, 'primary-adopter'))

router.route(paths.getPath('otherParentWorkAndPay.partner'))
  .get(otherParentWorkAndPayGet.bind(this, 'partner'))
  .post(otherParentWorkAndPayPost.bind(this, 'partner'))

function getParent (parentUrlPart) {
  return parentUrlPart === 'partner' ? 'secondary' : 'primary'
}

module.exports = router
