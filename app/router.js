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

registerRouteForEachParent('checkEligibility', {
  post: function (parentUrlPart, req, res) {
    res.redirect(paths.getPath(`employmentStatus.${parentUrlPart}`))
  }
})

registerRouteForEachParent('employmentStatus', {
  get: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    res.render('employment-status', { currentParent })
  },
  post: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    if (!validate.employmentStatus(req, currentParent)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.getPath(`workAndPay.${parentUrlPart}`))
  }
})

registerRouteForEachParent('workAndPay', {
  get: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    res.render('work-and-pay', { currentParent })
  },
  post: function (parentUrlPart, req, res) {
    const currentParent = getParent(parentUrlPart)
    if (!validate.workAndPay(req, currentParent)) {
      return res.redirect(req.url)
    }
    res.redirect(paths.getPath(`otherParentWorkAndPay.${parentUrlPart}`))
  }
})

registerRouteForEachParent('otherParentWorkAndPay', {
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

function registerRouteForEachParent (path, handlers) {
  const parents = ['mother', 'primary-adopter', 'partner']
  for (const parent of parents) {
    const route = router.route(paths.getPath(`${path}.${parent}`))
    if (handlers.get) {
      route.get(handlers.get.bind(this, parent))
    }
    if (handlers.post) {
      route.post(handlers.post.bind(this, parent))
    }
  }
}

function getParent (parentUrlPart) {
  return parentUrlPart === 'partner' ? 'secondary' : 'primary'
}

module.exports = router
