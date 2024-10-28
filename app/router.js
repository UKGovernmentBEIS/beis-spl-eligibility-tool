const config = require('./config')
const express = require('express')
const router = express.Router()
const emailjsemail = require('./emailjs-mailer')
const paths = require('./paths')
const validate = require('./validate')
const skip = require('./skip')
const {
  getParent,
  registerRouteForEachParent,
  plannerQueryString,
  getJourneyTime
} = require('./lib/routerUtils')
const { isNo, primaryUrlName } = require('../common/lib/dataUtils')
const options = {
  publicKey: config.publicKey,
  privateKey: config.privateKey
}
const emailjsIds = {
  serviceID: config.serviceID,
  templateID: config.templateID
}

const healthcheck = require('./lib/healthcheck')
router.use(healthcheck)

router.get(paths.getPath('root'), function (req, res) {
  // In production, the start page is hosted separately on GOV.UK.
  // In testing, we render our index view.
  req.session.timings = req.session.timings || { eligibilityStart: Date.now() }
  if (process.env.START_PAGE) {
    res.redirect(process.env.START_PAGE)
  } else {
    res.redirect(paths.getPath('natureOfParenthood'))
  }
})

router.route(paths.getPath('natureOfParenthood'))
  .get(function (req, res) {
    req.session.timings = req.session.timings || { eligibilityStart: Date.now() }
    res.render('nature-of-parenthood')
  })
  .post(function (req, res) {
    if (!validate.natureOfParenthood(req)) {
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
    res.redirect(paths.getPath('whichParent'))
  })

router.route(paths.getPath('whichParent'))
  .get(function (req, res) {
    res.render('which-parent')
  })
  .post(function (req, res) {
    if (!validate.whichParent(req)) {
      return res.redirect(req.url)
    }
    const data = req.session.data
    const parent = data['which-parent'] === 'secondary' ? 'partner' : primaryUrlName(data)
    res.redirect(paths.getPath(`employmentStatus.${parent}`))
  })

registerRouteForEachParent(router, 'employmentStatus', {
  get: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    if (skip.employmentStatus(req.session.data, currentParent)) {
      return res.redirect(paths.getPreviousWorkflowPath(req.url, req.session.data))
    }
    res.render('employment-status', { currentParent })
  },
  post: function (parentUrlPart, req, res) {
    const { data } = req.session
    const currentParent = getParent(parentUrlPart)
    if (!validate.employmentStatus(req, currentParent)) {
      return res.redirect(req.url)
    }
    if (skip.workAndPay(data, currentParent) && skip.otherParentWorkAndPay(data, currentParent) && skip.nextParent(data, currentParent)) {
      res.redirect(paths.getPath('results'))
    } else if (skip.workAndPay(data, currentParent) && skip.otherParentWorkAndPay(data, currentParent)) {
      res.redirect(paths.getPath('employmentStatus.partner'))
    } else if (skip.workAndPay(data, currentParent)) {
      res.redirect(paths.getPath(`otherParentWorkAndPay.${parentUrlPart}`))
    } else {
      res.redirect(paths.getPath(`workAndPay.${parentUrlPart}`))
    }
  }
})

registerRouteForEachParent(router, 'workAndPay', {
  get: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    if (skip.workAndPay(req.session.data, currentParent)) {
      return res.redirect(paths.getPreviousWorkflowPath(req.url, req.session.data))
    }
    res.render('work-and-pay', { currentParent })
  },
  post: function (parentUrlPart, req, res) {
    const { data } = req.session
    const currentParent = getParent(parentUrlPart)
    if (!validate.workAndPay(req, currentParent)) {
      return res.redirect(req.url)
    }
    if (skip.otherParentWorkAndPay(data, currentParent) && skip.nextParent(data, currentParent)) {
      res.redirect(paths.getPath('results'))
    } else if (skip.otherParentWorkAndPay(data, currentParent)) {
      res.redirect(paths.getPath('employmentStatus.partner'))
    } else {
      res.redirect(paths.getPath(`otherParentWorkAndPay.${parentUrlPart}`))
    }
  }
})

registerRouteForEachParent(router, 'otherParentWorkAndPay', {
  get: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    if (skip.otherParentWorkAndPay(req.session.data, currentParent)) {
      return res.redirect(paths.getPreviousWorkflowPath(req.url, req.session.data))
    }
    res.render('other-parent-work-and-pay', { currentParent })
  },
  post: function (parentUrlPart, req, res) {
    const { data } = req.session
    const currentParent = getParent(parentUrlPart)
    if (!validate.otherParentWorkAndPay(req, currentParent)) {
      return res.redirect(req.url)
    }
    if (skip.nextParent(data, currentParent)) {
      res.redirect(paths.getPath('results'))
    } else {
      res.redirect(paths.getPath('employmentStatus.partner'))
    }
  }
})

router.route(paths.getPath('results'))
  .get(function (req, res) {
    req.session.timings.eligibilityEnd = Date.now()
    res.render('results', { plannerQueryString: plannerQueryString(req.session.data, req.session.timings), journeyTime: getJourneyTime(req.session.timings) })
  })

router.route(paths.getPath('notCaringWithPartner'))
  .get(function (req, res) {
    res.render('not-caring-with-partner')
  })

router.route(paths.getPath('feedbackConfirmation'))
  .get(function (req, res) {
    const referrer = req.header('Referrer')
    res.render('feedback/feedback-confirmation', { referrer })
  })

router.route(paths.getPath('feedback'))
  .get(function (req, res) {
    const referrer = req.header('Referrer')
    res.render('feedback/feedback', { referrer })
  })
  .post(function (req, res) {
    const experience = req.body.feedback
    const moreDetail = req.body['feedback-more-detail']
    emailjsemail(experience, moreDetail, emailjsIds, options)
      .then(() => res.redirect('feedback/confirmation'))
  })

router.route(paths.getPath('cookies'))
  .get(function (req, res) {
    const referrer = req.header('Referrer')
    res.render('privacy/cookies', { referrer })
  })

router.route(paths.getPath('contact-us'))
  .get(function (req, res) {
    const referrer = req.header('Referrer')
    res.render('feedback/contact-us', { referrer })
  })

router.route(paths.getPath('accessibilityStatement'))
  .get(function (req, res) {
    const referrer = req.header('Referrer')
    res.render('accessibility-statement', { referrer })
  })

router.route(paths.getPath('privacyPolicy'))
  .get(function (req, res) {
    const referrer = req.header('Referrer')
    res.render('privacy-policy', { referrer })
  })

module.exports = router
