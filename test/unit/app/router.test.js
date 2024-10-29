'use strict'

const supertest = require('supertest')

const { describe, it, beforeEach } = require('mocha')

const paths = require('../../../app/paths')
const getApp = require('../../../server').getApp

let app

beforeEach(() => {
  app = supertest(getApp())
})

describe('GET /', () => {
  it('returns 302 status and redirects to the first question page', done => {
    supertest(getApp())
      .get(paths.getPath('root'))
      .expect(302)
      .expect('Location', paths.getPath('natureOfParenthood'))
      .end(done)
  })
})

describe('POST natureOfParenthood', () => {
  it('redirects back to nature-of-parenthood if nature-of-parenthood not provided', done => {
    app.post(paths.getPath('natureOfParenthood'))
      .expect(302)
      .expect('Location', paths.getPath('natureOfParenthood'))
      .end(done)
  })

  it('redirects to caringWithPartner if nature-of-parenthood provided', done => {
    app.post(paths.getPath('natureOfParenthood'))
      .send({ 'nature-of-parenthood': 'birth' })
      .expect(302)
      .expect('Location', paths.getPath('caringWithPartner'))
      .end(done)
  })
})

describe('POST caringWithPartner', () => {
  it('redirects back to caringWithPartner if caring-with-partner not provided', done => {
    app.post(paths.getPath('caringWithPartner'))
      .expect(302)
      .expect('Location', paths.getPath('caringWithPartner'))
      .end(done)
  })

  it('redirects to startDate if caring-with-partner provided', done => {
    app.post(paths.getPath('caringWithPartner'))
      .send({ 'caring-with-partner': 'yes' })
      .expect(302)
      .expect('Location', paths.getPath('startDate'))
      .end(done)
  })
})

describe('POST startDate', () => {
  describe('when date is invalid', () => {
    it('when day is invalid, redirects back to startDate', done => {
      const payload = {
        'start-date-day': '30',
        'start-date-month': '02',
        'start-date-year': '2019'
      }

      app.post(paths.getPath('startDate'))
        .send(payload)
        .expect(302)
        .expect('Location', paths.getPath('startDate'))
        .end(done)
    })

    it('when month is invalid, redirects back to startDate', done => {
      const payload = {
        'start-date-day': '02',
        'start-date-month': '13',
        'start-date-year': '2019'
      }

      app.post(paths.getPath('startDate'))
        .send(payload)
        .expect(302)
        .expect('Location', paths.getPath('startDate'))
        .end(done)
    })

    it('when date is more than a year from today, redirects back to startDate', done => {
      const payload = {
        'start-date-day': '02',
        'start-date-month': '11',
        'start-date-year': new Date().getFullYear() + 2
      }

      app.post(paths.getPath('startDate'))
        .send(payload)
        .expect(302)
        .expect('Location', paths.getPath('startDate'))
        .end(done)
    })
  })

  it('redirects to which-parent when date is valid', done => {
    const payload = {
      'start-date-day': '02',
      'start-date-month': '11',
      'start-date-year': new Date().getFullYear().toString()
    }

    app.post(paths.getPath('startDate'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('whichParent'))
      .end(done)
  })
})

describe('POST employmentStatus with a parent', () => {
  it('redirects back to employmentStatus with the same parent when employment-status not provided', done => {
    app.post(paths.getPath('employmentStatus.mother'))
      .expect(302)
      .expect('Location', paths.getPath('employmentStatus.mother'))
      .end(done)
  })

  it('redirects to workAndPay with the same parent when employment-status is provided', done => {
    app.post(paths.getPath('employmentStatus.mother'))
      .send({ primary: { 'employment-status': 'employee' } })
      .expect(302)
      .expect('Location', paths.getPath('workAndPay.mother'))
      .end(done)
  })
})

describe('POST workAndPay with a parent', () => {
  it('redirects back to workAndPay with the same parent when work-start not provided', done => {
    const payload = {
      primary: {
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      }
    }

    app.post(paths.getPath('workAndPay.mother'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('workAndPay.mother'))
      .end(done)
  })

  it('redirects back to workAndPay with the same parent when continuous-work not provided', done => {
    const payload = {
      primary: {
        'work-start': 'yes',
        'pay-threshold': 'yes'
      }
    }

    app.post(paths.getPath('workAndPay.mother'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('workAndPay.mother'))
      .end(done)
  })

  it('redirects back to workAndPay with the same parent when pay-threshold not provided', done => {
    const payload = {
      primary: {
        'work-start': 'yes',
        'continuous-work': 'yes'
      }
    }

    app.post(paths.getPath('workAndPay.mother'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('workAndPay.mother'))
      .end(done)
  })

  it('redirects to otherParentWorkAndPay with the same parent when employment-status is provided', done => {
    const payload = {
      primary: {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      }
    }

    app.post(paths.getPath('workAndPay.mother'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('otherParentWorkAndPay.mother'))
      .end(done)
  })
})
