const delve = require('dlv')
const validate = require('./validate')
const isString = require('lodash/isString')

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
*/

class Paths {
  constructor () {
    this.pathObjects = {
      root: {
        url: '/'
      },
      birthOrAdoption: {
        url: '/birth-or-adoption',
        workflowParentPath: '/',
        validator: validate.birthOrAdoption
      },
      caringWithPartner: {
        url: '/caring-with-partner',
        workflowParentPath: '/birth-or-adoption',
        validator: validate.caringWithPartner
      },
      startDate: {
        url: '/start-date',
        workflowParentPath: '/caring-with-partner',
        validator: validate.startDate
      },
      results: {
        url: '/results',
        workflowParentPath: '/start-date'
      },
      checkEligibility: {
        mother: {
          url: '/mother/check-eligibility'
        },
        'primary-adopter': {
          url: '/primary-adopter/check-eligibility'
        },
        partner: {
          url: '/partner/check-eligibility'
        }
      },
      employmentStatus: {
        mother: {
          url: '/mother/employment-status',
          workflowParentPath: '/results',
          validator: req => validate.employmentStatus(req, 'primary')
        },
        'primary-adopter': {
          url: '/primary-adopter/employment-status',
          workflowParentPath: '/results',
          validator: req => validate.employmentStatus(req, 'primary')
        },
        partner: {
          url: '/partner/employment-status',
          workflowParentPath: '/results',
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
        partner: {
          url: '/partner/other-parent-work-and-pay',
          workflowParentPath: '/partner/work-and-pay',
          validator: req => validate.otherParentWorkAndPay(req, 'secondary')
        }
      },
      notCaringWithPartner: {
        url: '/not-caring-with-partner',
        workflowParentPath: '/caring-with-partner'
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
        if (isString(subObject)) {
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

  getPreviousWorkFlowPath (url) {
    const pathObject = this.getPathObjectFromUrl(url)
    return pathObject ? pathObject.workflowParentPath : undefined
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

        if (isString(subObj)) {
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
