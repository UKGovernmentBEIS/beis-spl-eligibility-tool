const delve = require('dlv')
const validate = require('./validate')
const _ = require('lodash')
const { primaryUrlName } = require('../common/lib/dataUtils')

/*
 * This class is used to manage all paths in the app.
 * An example pathObjects is given below:
 * {
 *    root: {
 *      url: '/'
 *    },
 *    firstPage: {
 *      url: '/first-page',
 *      workflowParentPath: '/'
 *      validator: firstPageValidatorFunction
 *    },
 *    secondPage: {
 *      firstCategory: {
 *        url: '/second-page/first-category,
 *        workflowParentPath: '/first-page',
 *        validator: secondPageValidatorFunction
 *      }
 *      secondCategory: {
 *        url: '/second-page/second-category,
 *        workflowParentPath: '/first-page',
 *        validator: secondPageValidatorFunction
 *      }
 *    }
 * }
 *
 * A path can be accessed using #getPath and passing a . seperated string of the necessary keys. For example,
 * paths.getAllPaths('secondPage.firstCategory') returns '/secondPage/first-category
 *
 * A path object can be accessed by passing the url to getPathObjectFromUrl
 *
 * The workflowParentPath property can take a function, which is called with the data object.
*/

class Paths {
  constructor () {
    this.pathObjects = {
      root: {
        url: '/'
      },
      natureOfParenthood: {
        url: '/nature-of-parenthood',
        workflowParentPath: '/',
        validator: validate.natureOfParenthood
      },
      caringWithPartner: {
        url: '/caring-with-partner',
        workflowParentPath: '/nature-of-parenthood',
        validator: validate.caringWithPartner
      },
      startDate: {
        url: '/start-date',
        workflowParentPath: '/caring-with-partner',
        validator: validate.startDate
      },
      whichParent: {
        url: '/which-parent',
        workflowParentPath: '/start-date',
        validate: validate.whichParent
      },
      employmentStatus: {
        mother: {
          url: '/mother/employment-status',
          workflowParentPath: '/which-parent',
          validator: req => validate.employmentStatus(req, 'primary')
        },
        'primary-adopter': {
          url: '/primary-adopter/employment-status',
          workflowParentPath: '/which-parent',
          validator: req => validate.employmentStatus(req, 'primary')
        },
        'parental-order-parent': {
          url: '/parental-order-parent/employment-status',
          workflowParentPath: '/which-parent',
          validator: req => validate.employmentStatus(req, 'primary')
        },
        partner: {
          url: '/partner/employment-status',
          workflowParentPath: data => {
            const parent = primaryUrlName(data)
            return `/${parent}/other-parent-work-and-pay`
          },
          validator: req => validate.employmentStatus(req, 'secondary')
        }
      },
      workAndPay: {
        mother: {
          url: '/mother/work-and-pay',
          workflowParentPath: '/mother/employment-status',
          validator: req => validate.workAndPay(req, 'primary')
        },
        'primary-adopter': {
          url: '/primary-adopter/work-and-pay',
          workflowParentPath: '/primary-adopter/employment-status',
          validator: req => validate.workAndPay(req, 'primary')
        },
        'parental-order-parent': {
          url: '/parental-order-parent/work-and-pay',
          workflowParentPath: '/parental-order-parent/employment-status',
          validator: req => validate.workAndPay(req, 'primary')
        },
        partner: {
          url: '/partner/work-and-pay',
          workflowParentPath: '/partner/employment-status',
          validator: req => validate.workAndPay(req, 'secondary')
        }
      },
      otherParentWorkAndPay: {
        mother: {
          url: '/mother/other-parent-work-and-pay',
          workflowParentPath: '/mother/work-and-pay',
          validator: req => validate.otherParentWorkAndPay(req, 'primary')
        },
        'primary-adopter': {
          url: '/primary-adopter/other-parent-work-and-pay',
          workflowParentPath: '/primary-adopter/work-and-pay',
          validator: req => validate.otherParentWorkAndPay(req, 'primary')
        },
        'parental-order-parent': {
          url: '/parental-order-parent/other-parent-work-and-pay',
          workflowParentPath: '/parental-order-parent/work-and-pay',
          validator: req => validate.otherParentWorkAndPay(req, 'primary')
        },
        partner: {
          url: '/partner/other-parent-work-and-pay',
          workflowParentPath: '/partner/work-and-pay',
          validator: req => validate.otherParentWorkAndPay(req, 'secondary')
        }
      },
      results: {
        url: '/results',
        workflowParentPath: '/partner/other-parent-work-and-pay'
      },
      notCaringWithPartner: {
        url: '/not-caring-with-partner',
        workflowParentPath: '/caring-with-partner'
      },
      feedback: {
        url: '/feedback'
      },
      feedbackConfirmation: {
        url: '/feedback-confirmation'
      },
      cookies: {
        url: '/cookies'
      }
    }
  }

  getPathObjectFromUrl (url) {
    function findObjectByUrl (obj, url) {
      for (let key in obj) {
        const subObject = obj[key]
        if (_.isString(subObject)) {
          continue
        }

        if (subObject.url === url) {
          return subObject
        }

        const objectMatchingUrl = findObjectByUrl(subObject, url)
        if (objectMatchingUrl) {
          return objectMatchingUrl
        }
      }
    }

    return findObjectByUrl(this.pathObjects, url)
  }

  getPreviousWorkflowPath (url, data) {
    const pathObject = this.getPathObjectFromUrl(url)
    const workflowParentPath = delve(pathObject, 'workflowParentPath', undefined)
    return _.isFunction(workflowParentPath) ? workflowParentPath(data) : workflowParentPath
  }

  getPath (location) {
    const pathLocation = location.split('.')
    return delve(this.pathObjects, pathLocation.concat(['url']))
  }

  getAllPaths () {
    function searchForUrl (obj) {
      let output = []
      for (let key in obj) {
        const subObj = obj[key]

        if (_.isString(subObj)) {
          continue
        }

        if (subObj.url) {
          output.push(subObj.url)
        }

        output = output.concat(searchForUrl(subObj))
      }
      return output
    }

    return searchForUrl(this.pathObjects)
  }

  getValidator (url) {
    return this.getPathObjectFromUrl(url).validator
  }
}

const paths = new Paths()

module.exports = paths
