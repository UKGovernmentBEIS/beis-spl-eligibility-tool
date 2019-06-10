function isYesOrNo (value) {
  return ['yes', 'no'].includes(value)
}

function prettyList (array) {
  switch (array.length) {
    case 0:
      return ''
    case 1:
      return array[0]
    default:
      const finalElement = array[array.length - 1]
      return array.slice(0, -1).join(', ') + ` and ${finalElement}`
  }
}

module.exports = {
  isYesOrNo,
  prettyList
}
