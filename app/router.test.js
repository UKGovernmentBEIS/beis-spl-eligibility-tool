'use strict'

const supertest = require('supertest')

const { describe, it, beforeEach } = require('mocha')

const paths = require('./paths')
const getApp = require('../server').getApp

let app

beforeEach(() => {
  app = supertest(getApp())
})

describe('GET /', () => {
  it('returns 200 status', done => {
    supertest(getApp())
      .get('/')
      .expect(200)
      .end(done)
  })
})

describe('POST birthOrAdoption', () => {
  it('redirects back to birth-or-adoption if birth-or-adoption not provided', done => {
    app.post(paths.birthOrAdoption)
      .expect(302)
      .expect('Location', paths.birthOrAdoption)
      .end(done)
  })

  it('redirects to caringWithPartner if birth-or-adoption provided', done => {
    app.post(paths.birthOrAdoption)
      .send({ 'birth-or-adoption': 'birth' })
      .expect(302)
      .expect('Location', paths.caringWithPartner)
      .end(done)
  })
})

describe('POST caringWithPartner', () => {
  it('redirects back to caringWithPartner if caring-with-partner not provided', done => {
    app.post(paths.caringWithPartner)
      .expect(302)
      .expect('Location', paths.caringWithPartner)
      .end(done)
  })

  it('redirects to startDate if caring-with-partner provided', done => {
    app.post(paths.caringWithPartner)
      .send({ 'caring-with-partner': 'yes' })
      .expect(302)
      .expect('Location', paths.startDate)
      .end(done)
  })
})

describe('POST startDate', () => {
  describe('when date is invalid', () => {
    it('when day is invalid, redirects back to caringWithpartner', done => {
      const payload = {
        'start-date-day': '30',
        'start-date-month': '02',
        'start-date-year': '2019'
      }

      app.post(paths.startDate)
        .send(payload)
        .expect(302)
        .expect('Location', paths.startDate)
        .end(done)
    })

    it('when month is invalid, redirects back to caringWithpartner', done => {
      const payload = {
        'start-date-day': '02',
        'start-date-month': '13',
        'start-date-year': '2019'
      }

      app.post(paths.startDate)
        .send(payload)
        .expect(302)
        .expect('Location', paths.startDate)
        .end(done)
    })

    it('when date is more than a year from today, redirects back to caringWithpartner', done => {
      const payload = {
        'start-date-day': '02',
        'start-date-month': '11',
        'start-date-year': new Date().getFullYear() + 2
      }

      app.post(paths.startDate)
        .send(payload)
        .expect(302)
        .expect('Location', paths.startDate)
        .end(done)
    })
  })

  it('redirects to results when date is valid', done => {
    const payload = {
      'start-date-day': '02',
      'start-date-month': '11',
      'start-date-year': new Date().getFullYear().toString()
    }

    app.post(paths.startDate)
      .send(payload)
      .expect(302)
      .expect('Location', paths.results)
      .end(done)
  })
})

describe('POST results when "current" param supplied', () => {
  it('redirects to employmentStatus and passes "current" param through', done => {
    app.post(paths.results + '/mother')
      .expect(302)
      .expect('Location', paths.employmentStatus + '/mother')
      .end(done)
  })
})

describe('POST employmentStatus with a parent', () => {
  it('redirects back to employmentStatus with the same parent when employment-status not provided', done => {
    app.post(paths.employmentStatus + '/mother')
      .expect(302)
      .expect('Location', paths.employmentStatus + '/mother')
      .end(done)
  })

  it('redirects to workAndPay with the same parent when employment-status is provided', done => {
    app.post(paths.employmentStatus + '/mother')
      .send({ primary: { 'employment-status': 'employee' } })
      .expect(302)
      .expect('Location', paths.workAndPay + '/mother')
      .end(done)
  })
})
