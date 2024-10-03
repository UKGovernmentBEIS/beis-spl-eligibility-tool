/* global gtag */

const { getGaFields, getNatureOfParenthood } = require('../../../common/lib/analyticsUtils')

function natureOfParenthood () {
  document.querySelector('[data-ga-hit-type=nature_of_parenthood]').addEventListener('click', function (e) {
    const gaFields = getGaFields(this)
    gaFields.nature_of_parenthood = getNatureOfParenthood()
    const gaHitType = this.getAttribute('data-ga-hit-type')
    gtag('event', gaHitType, gaFields)
  })
}

function eligibility (eligibilities) {
  const gaFields = {
    event_category: 'eligibility_questions',
    event_action: 'eligibility_result',
    nature_of_parenthood: getNatureOfParenthood()
  }
  const parents = ['primary', 'secondary']
  const policies = ['spl', 'shpp']

  let sendData = false
  parents.forEach(parent => {
    policies.forEach(policy => {
      if (eligibilities[parent][policy] !== 'unknown') {
        sendData = true
        const isEligible = eligibilities[parent][policy] === 'eligible'
        gaFields[`${parent}_eligibility_${policy}`] = isEligible
      }
    })
  })
  if (sendData) {
    gtag('event', 'parent_eligibility', gaFields)
  }
}

window.analytics = {
  eligibility,
  natureOfParenthood
}
