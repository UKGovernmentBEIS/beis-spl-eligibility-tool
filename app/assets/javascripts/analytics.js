/* global gtag */

const { getGaFields, getBirthOrAdoption } = require('../../../common/lib/analyticsUtils')

function birthOrAdoption () {
  document.querySelector('[data-ga-hit-type=parent_type]').addEventListener('click', function (e) {
    const gaFields = getGaFields(this)
    gaFields['birth_or_adoption'] = getBirthOrAdoption()
    const gaHitType = this.getAttribute('data-ga-hit-type')
    gtag('event', gaHitType, gaFields)
  })
}

function eligibility (eligibilities) {
  const gaFields = {
    event_category: 'eligibility_questions',
    event_action: 'eligibility_result',
    birth_or_adoption: getBirthOrAdoption()
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
  birthOrAdoption
}
