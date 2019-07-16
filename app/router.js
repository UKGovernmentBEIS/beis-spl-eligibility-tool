const express = require('express')
const router = express.Router()
const paths = require('./paths')
const validate = require('./validate')
const {
  getParent,
  registerRouteForEachParent,
  parentMeetsContinuousWorkThreshold,
  parentMeetsPayAndContinuousWorkThresholds,
  plannerQueryString,
  parentIsWorker,
  parentIsEmployee
} = require('./lib/routerUtils')
const { isNo } = require('../common/lib/dataUtils')

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
    if (isNo(req.session.data['caring-with-partner'])) {
      res.redirect(paths.getPath('notCaringWithPartner'))
    } else {
      res.redirect(paths.getPath('startDate'))
    }
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
    res.render('results', { plannerQueryString: plannerQueryString(req.session.data) })
  })

registerRouteForEachParent(router, 'checkEligibility', {
  post: function (parentUrlPart, req, res) {
    res.redirect(paths.getPath(`employmentStatus.${parentUrlPart}`))
  }
})

registerRouteForEachParent(router, 'employmentStatus', {
  get: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    res.render('employment-status', { currentParent })
  },
  post: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    if (!validate.employmentStatus(req, currentParent)) {
      return res.redirect(req.url)
    }
    const parent = req.session.data[currentParent]
    if (['self-employed', 'unemployed'].includes(parent['employment-status'])) {
      res.redirect(paths.getPath('results'))
    } else {
      res.redirect(paths.getPath(`workAndPay.${parentUrlPart}`))
    }
  }
})

registerRouteForEachParent(router, 'workAndPay', {
  get: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    res.render('work-and-pay', { currentParent })
  },
  post: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    if (!validate.workAndPay(req, currentParent)) {
      return res.redirect(req.url)
    }
    const { data } = req.session
    if (
      parentIsWorker(data, currentParent) &&
      !parentMeetsPayAndContinuousWorkThresholds(data, currentParent)
    ) {
      res.redirect(paths.getPath('results'))
    } else if (
      parentIsEmployee(data, currentParent) &&
      !parentMeetsContinuousWorkThreshold(data, currentParent)
    ) {
      res.redirect(paths.getPath('results'))
    } else {
      res.redirect(paths.getPath(`otherParentWorkAndPay.${parentUrlPart}`))
    }
  }
})

registerRouteForEachParent(router, 'otherParentWorkAndPay', {
  get: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    res.render('other-parent-work-and-pay', { currentParent })
  },
  post: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    if (!validate.otherParentWorkAndPay(req, currentParent)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.getPath('results'))
  }
})

router.route(paths.getPath('notCaringWithPartner'))
  .get(function (req, res) {
    res.render('not-caring-with-partner')
  })

router.route(paths.getPath('feedback'))
  .get(function (req, res) {
    const referrer = req.header('Referrer')
    res.render('feedback/feedback', { referrer })
  })
router.route(paths.getPath('cookies'))
  .get(function (req, res) {
    const referrer = req.header('Referrer')
    res.render('privacy/cookies', { referrer })
  })

module.exports = router
