'use strict'

const supertest = require('supertest')
const session = require('supertest-session')
const sinon = require('sinon')
const proxyrequire = require('proxyquire')

const { describe, it, beforeEach } = require('mocha')

const paths = require('../../../app/paths')
const getApp = require('../../../server').getApp

let app

beforeEach(() => {
  app = supertest(getApp())
})

describe('GET /', () => {
  it('returns 302 status and redirects to the first question page', (done) => {
    supertest(getApp())
      .get(paths.getPath('root'))
      .expect(302)
      .expect('Location', paths.getPath('natureOfParenthood'))
      .end(done)
  })
})

describe('GET natureOfParenthood', () => {
  it('renders the nature-of-parenthood page', (done) => {
    app
      .get(paths.getPath('natureOfParenthood'))
      .expect(200)
      .expect((res) => {
        if (!res.text.includes('nature-of-parenthood')) {
          throw new Error('Missing nature-of-parenthood content')
        }
      })
      .end(done)
  })
})

describe('POST natureOfParenthood', () => {
  it('redirects back to nature-of-parenthood if nature-of-parenthood not provided', (done) => {
    app
      .post(paths.getPath('natureOfParenthood'))
      .expect(302)
      .expect('Location', paths.getPath('natureOfParenthood'))
      .end(done)
  })

  it('redirects to caringWithPartner if nature-of-parenthood provided', (done) => {
    app
      .post(paths.getPath('natureOfParenthood'))
      .send({ 'nature-of-parenthood': 'birth' })
      .expect(302)
      .expect('Location', paths.getPath('caringWithPartner'))
      .end(done)
  })
})

describe('GET caringWithPartner', () => {
  let testSession

  beforeEach((done) => {
    testSession = session(getApp())
    testSession
      .post(paths.getPath('natureOfParenthood'))
      .send({ 'nature-of-parenthood': 'birth' })
      .expect(302)
      .end(done)
  })

  it('renders the caring-with-partner page after visiting natureOfParenthood', (done) => {
    testSession
      .get(paths.getPath('caringWithPartner'))
      .expect(200)
      .expect((res) => {
        if (!res.text.includes('caring-with-partner')) {
          throw new Error('Missing caring-with-partner content')
        }
      })
      .end(done)
  })
})

describe('GET startDate', () => {
  let testSession

  beforeEach((done) => {
    testSession = session(getApp())
    testSession
      .post(paths.getPath('natureOfParenthood'))
      .send({ 'nature-of-parenthood': 'birth' })
      .expect(302)
      .end((err) => {
        if (err) return done(err)
        testSession
          .post(paths.getPath('caringWithPartner'))
          .send({ 'caring-with-partner': 'yes' })
          .expect(302)
          .end(done)
      })
  })

  it('renders the startDate page after visiting caringWithPartner', (done) => {
    testSession
      .get(paths.getPath('startDate'))
      .expect(200)
      .expect((res) => {
        if (!res.text.includes('start-date')) {
          throw new Error('Missing start-date content')
        }
      })
      .end(done)
  })
})

describe('POST caringWithPartner', () => {
  it('redirects back to caringWithPartner if caring-with-partner not provided', (done) => {
    app
      .post(paths.getPath('caringWithPartner'))
      .expect(302)
      .expect('Location', paths.getPath('caringWithPartner'))
      .end(done)
  })

  it('redirects to notCaringWithPartner if caring-with-partner provided', (done) => {
    app
      .post(paths.getPath('caringWithPartner'))
      .send({ 'caring-with-partner': 'no' })
      .expect(302)
      .expect('Location', paths.getPath('notCaringWithPartner'))
      .end(done)
  })

  it('redirects to startDate if caring-with-partner provided', (done) => {
    app
      .post(paths.getPath('caringWithPartner'))
      .send({ 'caring-with-partner': 'yes' })
      .expect(302)
      .expect('Location', paths.getPath('startDate'))
      .end(done)
  })
})

describe('POST startDate', () => {
  describe('when date is invalid', () => {
    it('when day is invalid, redirects back to startDate', (done) => {
      const payload = {
        'start-date-day': '30',
        'start-date-month': '02',
        'start-date-year': '2019'
      }

      app
        .post(paths.getPath('startDate'))
        .send(payload)
        .expect(302)
        .expect('Location', paths.getPath('startDate'))
        .end(done)
    })

    it('when month is invalid, redirects back to startDate', (done) => {
      const payload = {
        'start-date-day': '02',
        'start-date-month': '13',
        'start-date-year': '2019'
      }

      app
        .post(paths.getPath('startDate'))
        .send(payload)
        .expect(302)
        .expect('Location', paths.getPath('startDate'))
        .end(done)
    })

    it('when date is more than a year from today, redirects back to startDate', (done) => {
      const payload = {
        'start-date-day': '02',
        'start-date-month': '11',
        'start-date-year': new Date().getFullYear() + 2
      }

      app
        .post(paths.getPath('startDate'))
        .send(payload)
        .expect(302)
        .expect('Location', paths.getPath('startDate'))
        .end(done)
    })
  })

  it('redirects to which-parent when date is valid', (done) => {
    const payload = {
      'start-date-day': '02',
      'start-date-month': '11',
      'start-date-year': new Date().getFullYear().toString()
    }

    app
      .post(paths.getPath('startDate'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('whichParent'))
      .end(done)
  })
})

describe('POST whichParent', () => {
  it('redirects back to whichParent if which-parent not provided', (done) => {
    app
      .post(paths.getPath('whichParent'))
      .expect(302)
      .expect('Location', paths.getPath('whichParent'))
      .end(done)
  })

  it('redirects to employmentStatus.partner if which-parent is secondary', (done) => {
    const payload = {
      'which-parent': 'secondary'
    }

    app
      .post(paths.getPath('whichParent'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('employmentStatus.partner'))
      .end(done)
  })

  it('redirects to employmentStatus.parental-order-parent if which-parent is primary', (done) => {
    const payload = {
      'which-parent': 'primary'
    }

    app
      .post(paths.getPath('whichParent'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('employmentStatus.parental-order-parent'))
      .end(done)
  })
})

describe('POST employmentStatus with a parent', () => {
  it('redirects back to employmentStatus with the same parent when employment-status not provided', (done) => {
    app
      .post(paths.getPath('employmentStatus.mother'))
      .expect(302)
      .expect('Location', paths.getPath('employmentStatus.mother'))
      .end(done)
  })

  it('redirects to workAndPay with the same parent when employment-status is provided', (done) => {
    app
      .post(paths.getPath('employmentStatus.mother'))
      .send({ primary: { 'employment-status': 'employee' } })
      .expect(302)
      .expect('Location', paths.getPath('workAndPay.mother'))
      .end(done)
  })
})

describe('POST workAndPay with a parent', () => {
  it('redirects back to workAndPay with the same parent when work-start not provided', (done) => {
    const payload = {
      primary: {
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      }
    }

    app
      .post(paths.getPath('workAndPay.mother'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('workAndPay.mother'))
      .end(done)
  })

  it('redirects back to workAndPay with the same parent when continuous-work not provided', (done) => {
    const payload = {
      primary: {
        'work-start': 'yes',
        'pay-threshold': 'yes'
      }
    }

    app
      .post(paths.getPath('workAndPay.mother'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('workAndPay.mother'))
      .end(done)
  })

  it('redirects back to workAndPay with the same parent when pay-threshold not provided', (done) => {
    const payload = {
      primary: {
        'work-start': 'yes',
        'continuous-work': 'yes'
      }
    }

    app
      .post(paths.getPath('workAndPay.mother'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('workAndPay.mother'))
      .end(done)
  })

  it('redirects to otherParentWorkAndPay with the same parent when employment-status is provided', (done) => {
    const payload = {
      primary: {
        'employment-status': 'employee',
        'work-start': 'yes',
        'continuous-work': 'yes',
        'pay-threshold': 'yes'
      }
    }

    app
      .post(paths.getPath('workAndPay.mother'))
      .send(payload)
      .expect(302)
      .expect('Location', paths.getPath('otherParentWorkAndPay.mother'))
      .end(done)
  })

  describe('GET /cookies', () => {
    it('/cookies should return 200 status', (done) => {
      supertest(getApp())
        .get(paths.getPath('cookies'))
        .expect(200)
        .end(done)
    })
  })

  describe('GET /contact-us', () => {
    it('/contact-us should return 200 status', (done) => {
      supertest(getApp())
        .get(paths.getPath('contact-us'))
        .expect(200)
        .end(done)
    })
  })

  describe('GET /accessibility-statement', () => {
    it('/accessibility-statement should return 200 status', (done) => {
      supertest(getApp())
        .get(paths.getPath('accessibilityStatement'))
        .expect(200)
        .end(done)
    })
  })

  describe('feedback', () => {
    describe('GET /feedback', () => {
      it('/feedback should return 200 status', (done) => {
        supertest(getApp())
          .get(paths.getPath('feedback'))
          .expect(200)
          .end(done)
      })
    })

    describe('POST /feedback', () => {
      beforeEach(() => {
        const emailjsSendStub = sinon
          .stub()
          .resolves({ status: 200, text: 'OK' })

        proxyrequire('../../../app/emailjs-mailer', {
          '@emailjs/nodejs': {
            send: emailjsSendStub
          }
        })
      })
      it('/feedback should return 302 status', (done) => {
        supertest(getApp())
          .post(paths.getPath('feedback'))
          .send({
            feedback: 'Great service!',
            'feedback-more-detail': 'No additional feedback',
            userAgent: 'test-agent',
            'spam-filter': 'yes'
          })
          .expect(302)
          .end(done)
      })

      it('should be redirected back to /feedback if url honeypot field is entered', (done) => {
        supertest(getApp())
          .post(paths.getPath('feedback'))
          .send({
            url: 'www.test-bot.com',
            feedback: 'Great service!',
            'feedback-more-detail': 'No additional feedback',
            userAgent: 'test-agent',
            'spam-filter': 'yes'
          })
          .expect(302)
          .end(done)
      })
    })
  })

  describe('GET /feedback/confirmation', () => {
    let testSession

    beforeEach((done) => {
      const emailjsSendStub = sinon
        .stub()
        .resolves({ status: 200, text: 'OK' })

      proxyrequire('../../../app/emailjs-mailer', {
        '@emailjs/nodejs': {
          send: emailjsSendStub
        }
      })

      testSession = session(getApp())
      testSession
        .post(paths.getPath('feedback'))
        .send({
          feedback: 'Great service!',
          'feedback-more-detail': 'No additional feedback',
          userAgent: 'test-agent',
          'spam-filter': 'yes'
        })
        .expect(302)
        .end(done)
    })

    it('renders the feedback confirmation page after visiting feedback page', (done) => {
      testSession
        .get(paths.getPath('feedbackConfirmation'))
        .expect(200)
        .expect((res) => {
          if (!res.text.includes('feedback-confirmation')) {
            throw new Error('Missing feedback-confirmation content')
          }
        })
        .end(done)
    })
  })
})
