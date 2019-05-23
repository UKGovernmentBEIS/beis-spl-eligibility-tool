class Workflow {
  constructor (paths) {
    this.parents = {
      root: null,
      birthOrAdoption: 'root',
      caringWithPartner: 'birthOrAdoption',
      startDate: 'caringWithPartner',
      results: 'startDate',
      employmentStatus: 'results',
      workAndPay: 'employmentStatus',
      otherParentWorkAndPay: 'workAndPay'
    }
    this.paths = paths
  }

  getPreviousPath (currentPathOrName) {
    const currentName = Object.keys(this.parents).includes(currentPathOrName)
      ? currentPathOrName
      : this.paths.getName(currentPathOrName)
    return this.paths.getPath(this._getParent(currentName))
  }

  getPartsOfPath (fullPath) {
    if (this._isFirst(fullPath)) { return { path: fullPath, parent: '' } }

    const [path, parent] = fullPath.match(/\/([a-z-])+\w+/g)
    return {
      path,
      parent: this._requiresParent(path) ? parent : ''
    }
  }

  buildRedirectPath (path, opts) {
    if (this._requiresParent(path)) {
      return path + opts.parent
    } else {
      return path
    }
  }

  _getParent (name) {
    return this.parents[name]
  }

  _requiresParent (pathOrName) {
    let requiresParent
    ['employmentStatus', 'workAndPay', 'otherParentWorkAndPay'].forEach(name => {
      if (pathOrName === name || this.paths.getPath(name) === pathOrName) {
        requiresParent = true
      }
    })
    return requiresParent
  }

  _isFirst (pathOrName) {
    return this._getParent(pathOrName) === null || this._getParent(this.paths.getName(pathOrName)) === null
  }
}

module.exports = Workflow
