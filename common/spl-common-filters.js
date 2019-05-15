// Existing filters can be imported from env using env.getFilter(name)
// See https://mozilla.github.io/nunjucks/api.html#getfilter
module.exports = function (env) {
  function primaryName (data) {
    return data['birth-or-adoption'] === 'birth' ? 'mother' : 'primary adopter'
  }

  function primaryNameForUrl (data) {
    return primaryName(data).split(' ').join('-')
  }

  function secondaryName (data) {
    return 'partner'
  }

  function secondaryNameForUrl (data) {
    return secondaryName(data).split(' ').join('-')
  }

  function currentParentName (data, currentParent) {
    const primaryNames = [
      'primary',
      'mother',
      'primary-adopter'
    ]

    if (primaryNames.some(name => name === currentParent)) {
      return primaryName(data)
    } else {
      return secondaryName(data)
    }
  }

  function isBirth (data) {
    return data['birth-or-adoption'] === 'birth'
  }

  function capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return {
    primaryName,
    primaryNameForUrl,
    secondaryName,
    secondaryNameForUrl,
    currentParentName,
    isBirth,
    capitalize,
    ...require('./macros/hidden-fields/filters')(env)
  }
}
