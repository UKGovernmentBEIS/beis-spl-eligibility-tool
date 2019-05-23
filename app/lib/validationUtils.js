function buildError (message, href) {
  return { text: message, href: href }
}

function isYesOrNo (value) {
  return ['yes', 'no'].includes(value)
}

function prettyList (array) {
  switch (array.length) {
    case 0:
      return ''
    case 1:
      return array[0]
    case 2:
      return array.join(' and ')
    default:
      const finalElement = array.pop()
      return array.join(', ') + ` and ${finalElement}`
  }
}

module.exports = {
  buildError,
  isYesOrNo,
  prettyList
}
