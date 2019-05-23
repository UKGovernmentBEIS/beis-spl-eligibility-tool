class Paths {
  constructor () {
    this.paths = {
      root: '/',
      birthOrAdoption: '/birth-or-adoption',
      caringWithPartner: '/caring-with-partner',
      startDate: '/start-date',
      results: '/results',
      employmentStatus: '/employment-status',
      // employmentStatus: {
      //   mother: '/employment-status/mother'
      // },
      workAndPay: '/work-and-pay',
      otherParentWorkAndPay: '/other-parent-work-and-pay'
    }
  }

  getPath (name) {
    return this.paths[name]
  }

  getName (path) {
    return Object.keys(this.paths).find(name => this.paths[name] === path)
  }

  getPaths () {
    return Object.values(this.paths)
  }
}

module.exports = new Paths()
