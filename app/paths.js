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
      employmentStatus: {
        mother: {
          url: '/employment-status/mother',
          workflowParentPath: '/results',
          validator: req => validate.employmentStatus(req, 'mother')
        },
        'primary-adopter': {
          url: '/employment-status/primary-adopter',
          workflowParentPath: '/results',
          validator: req => validate.employmentStatus(req, 'primary-adopter')
        },
        partner: {
          url: '/employment-status/partner',
          workflowParentPath: '/results',
          validator: req => validate.employmentStatus(req, 'partner')
        }
      },
      workAndPay: {
        mother: {
          url: '/work-and-pay/mother',
          workflowParentPath: '/employment-status/mother',
          validator: req => validate.workAndPay(req, 'mother')
        },
        'primary-adopter': {
          url: '/work-and-pay/primary-adopter',
          workflowParentPath: '/employment-status/primary-adopter',
          validator: req => validate.workAndPay(req, 'primary-adopter')
        },
        partner: {
          url: '/work-and-pay/partner',
          workflowParentPath: '/employment-status/partner',
          validator: req => validate.workAndPay(req, 'partner')
        }
      },
      otherParentWorkAndPay: {
        mother: {
          url: '/other-parent-work-and-pay/mother',
          workflowParentPath: '/work-and-pay/mother',
          validator: req => validate.otherParentWorkAndPay(req, 'mother')
        },
        'primary-adopter': {
          url: '/other-parent-work-and-pay/primary-adopter',
          workflowParentPath: '/work-and-pay/primary-adopter',
          validator: req => validate.otherParentWorkAndPay(req, 'primary-adopter')
        },
        partner: {
          url: '/other-parent-work-and-pay/partner',
          workflowParentPath: '/work-and-pay/partner',
          validator: req => validate.otherParentWorkAndPay(req, 'partner')
        }
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
