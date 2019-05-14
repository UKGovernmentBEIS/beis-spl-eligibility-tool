// Existing filters can be imported from env using env.getFilter(name)
// See https://mozilla.github.io/nunjucks/api.html#getfilter
module.exports = function (env) {
  function primaryName (data) {
    return data['birth-or-adoption'] === 'birth' ? 'mother' : 'primary adopter'
  }

  function secondaryName (data) {
    return 'partner'
  }

  function currentParentName (data, currentParent) {
    return currentParent === 'primary' ? primaryName(data) : secondaryName(data)
  }

  function isBirth (data) {
    return data['birth-or-adoption'] === 'birth'
  }

  function capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return {
    primaryName,
    secondaryName,
    currentParentName,
    isBirth,
    capitalize,
    ...require('./macros/hidden-fields/filters')(env)
  }
}
