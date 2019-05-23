class Paths {
  constructor () {
    this.pathObjects = [
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
    return this.pathObjects.findIndex(pathObject => pathObject.path === pathOrName || pathObject.name === pathOrName)
  }

  getPreviousPath (currentPathNameOrIndex) {
    if (this._isRoot(currentPathNameOrIndex)) { return null }

    if (Number.isInteger(currentPathNameOrIndex)) {
      return this.getPath(currentPathNameOrIndex - 1)
    } else {
      const previousIndex = this.getIndex(currentPathNameOrIndex) - 1
      return this.getPath(previousIndex)
    }
  }

  getPaths () {
    return this.pathObjects.reduce((pathObject, currentPath) => {
      pathObject[currentPath.name] = currentPath.path
      return pathObject
    }, {})
  }

  _isRoot (pathNameOrIndex) {
    return [0, '/', 'root'].includes(pathNameOrIndex)
  }

  _get (pathNameOrIndex) {
    if (Number.isInteger(pathNameOrIndex)) {
      return this.pathObjects[pathNameOrIndex]
    } else {
      return this.pathObjects.find(pathObject => pathObject.path === pathNameOrIndex || pathObject.name === pathNameOrIndex)
    }
  }
}

module.exports = new Paths()
