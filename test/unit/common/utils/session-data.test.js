const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const paths = require('../../../../app/paths')
const sessionData = require('../../../../common/utils/session-data')

describe('sessionDatasessionData', function () {
  let req, res, next

  beforeEach(function () {
    req = {
      method: 'GET',
      query: {},
      session: { data: {} },
      path: '/some-path'
    }

    res = {
      redirect: sinon.spy(),
      locals: {}
    }

    next = sinon.spy()
  })

  describe('GET with data-in-query', function () {
    it('should store query data in session and redirect', function () {
      req.query['data-in-query'] = 'true'
      req.query = { 'data-in-query': 'true', key: 'value' }

      sessionData(req, res, next)

      expect(req.session.data).to.deep.equal({ key: 'value' })
      expect(res.redirect.calledOnce).to.equal(true)
      expect(res.redirect.calledWith(req.path)).to.equal(true)
      expect(next.called).to.equal(false)
    })

    it('should not call next after redirect for GET with data-in-query', function () {
      req.query['data-in-query'] = 'true'

      sessionData(req, res, next)

      expect(next.called).to.equal(false)
    })
  })

  describe('POST requests', function () {
    it('should store body in session and call next', function () {
      req.method = 'POST'
      req.body = { key: 'value' }

      sessionData(req, res, next)

      expect(req.session.data).to.deep.equal({ key: 'value' })
      expect(next.calledOnce).to.equal(true)
    })
  })

  describe('Non-GET/POST requests with no session data', function () {
    it('should initialize session data if not present', function () {
      req.session.data = undefined

      sessionData(req, res, next)

      expect(req.session.data).to.deep.equal({})
      expect(next.calledOnce).to.equal(true)
    })
  })

  describe('res.locals.withData', function () {
    it('should generate a URL with query data from session', function () {
      req.session.data = { key: 'value' }

      sessionData(req, res, next)

      const withDataUrl = res.locals.withData('/test-path', { extra: 'data' })
      expect(withDataUrl).to.equal('/test-path?data-in-query=true&key=value&extra=data')
    })
  })

  describe('res.locals.backPath', function () {
    it('should generate a backPath using getPreviousWorkflowPath', function () {
      const getPreviousWorkflowPathStub = sinon
        .stub(paths, 'getPreviousWorkflowPath')
        .returns('/previous-path')

      req.session.data = { key: 'value' }
      req.path = '/current-path'

      sessionData(req, res, next)

      const backPath = res.locals.backPath()
      expect(backPath).to.equal('/previous-path?data-in-query=true&key=value')

      getPreviousWorkflowPathStub.restore()
    })
  })
})
