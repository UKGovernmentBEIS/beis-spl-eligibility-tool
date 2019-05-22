class Paths {
  constructor () {
    this.paths = [
      {
        path: '/',
        name: 'root'
      },
      {
        path: '/birth-or-adoption',
        name: 'birthOrAdoption'
      },
      {
        path: '/caring-with-partner',
        name: 'caringWithPartner'
      },
      {
        path: '/start-date',
        name: 'startDate'
      },
      {
        path: '/results',
        name: 'results'
      },
      {
        path: '/employment-status',
        name: 'employmentStatus'
      },
      {
        path: '/work-and-pay',
        name: 'workAndPay'
      },
      {
        path: '/other-parent-work-and-pay',
        name: 'otherParentWorkAndPay'
      }
    ]
  }

  getPath (nameOrIndex) {
    return this._get(nameOrIndex).path
  }

  getName (pathOrIndex) {
    return this._get(pathOrIndex).name
  }

  getIndex (pathOrName) {
    return this.paths.findIndex(path => path.path === pathOrName || path.name === pathOrName)
  }

  getPaths () {
    return this.paths.reduce((pathsObject, currentPath) => {
      pathsObject[currentPath.name] = currentPath.path
      return pathsObject
    }, {})
  }

  _get (pathNameOrIndex) {
    if (Number.isInteger(pathNameOrIndex)) {
      return this.paths[pathNameOrIndex]
    } else {
      return this.paths.find(path => path.path === pathNameOrIndex || path.name === pathNameOrIndex)
    }
  }
}

module.exports = new Paths()
