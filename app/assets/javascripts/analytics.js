/* global gtag, getGaFields */

function birthOrAdoption () {
  document.querySelector('[data-ga-hit-type=parent-type]').addEventListener('click', function (e) {
    const gaFields = getGaFields(this)
    gaFields['birth_or_adoption'] = document.querySelector('input[name=birth-or-adoption]:checked').value
    const gaHitType = this.getAttribute('data-ga-hit-type')
    gtag('event', gaHitType, gaFields)
  })
}

function eligibility (eligibilities) {
  const gaFields = {
    event_category: 'eligibility-questions',
    event_action: 'eligibility-result',
    birth_or_adoption: document.querySelector('[name=birth-or-adoption]').value
  }
  const parents = ['primary', 'secondary']
  const policies = ['spl', 'shpp']
  parents.forEach(parent => {
    policies.forEach(policy => {
      if (eligibilities[parent][policy] !== 'unknown') {
        const isEligible = eligibilities[parent][policy] === 'eligible'
        gaFields[`${parent}_eligibility_${policy}`] = isEligible
      }
    })
  })
  gtag('event', 'parent-eligibility', gaFields)
}

window.analytics = {
  eligibility,
  birthOrAdoption
}
