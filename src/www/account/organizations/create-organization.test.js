/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/account/organizations/create-organization`, async () => {
  describe('CreateOrganization#GET', () => {
    it('should present the form', async () => {
      const owner = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/create-organization`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        assert.notEqual(null, doc.getElementById('name'))
        assert.notEqual(null, doc.getElementById('submit-form'))
        assert.notEqual(null, doc.getElementById('submit-button'))
      }
      return req.route.api.get(req, res)
    })
  })

  describe('CreateOrganization#POST', () => {
    it('should reject missing name', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization', 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: ''
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        const message = doc.getElementById('message-container').child[0]
        assert.equal('invalid-organization-name', message.attr.error)
      }
      return req.route.api.post(req, res)
    })

    it('should reject short name', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization', 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: '1'
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        const message = doc.getElementById('message-container').child[0]
        assert.equal('invalid-organization-name-length', message.attr.error)
      }
      global.MINIMUM_ORGANIZATION_NAME_LENGTH = 100
      return req.route.api.post(req, res)
    })

    it('should reject long name', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization', 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: '123456'
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        const message = doc.getElementById('message-container').child[0]
        assert.equal('invalid-organization-name-length', message.attr.error)
      }
      global.MAXIMUM_ORGANIZATION_NAME_LENGTH = 1
      return req.route.api.post(req, res)
    })

    it('should reject invalid fields', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization', 'POST')
      req.session = user.session
      req.account = user.account
      req.body = {
        name: 'org-name',
        invalid: 'field'
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        const message = doc.getElementById('message-container').child[0]
        assert.equal('invalid-organization-field', message.attr.error)
      }
      return req.route.api.post(req, res)
    })

    it('should enforce field length', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization', 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: 'org-name',
        email: 'test@test.com'
      }
      global.MAXIMUM_ORGANIZATION_FIELD_LENGTH = 1
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        const message = doc.getElementById('message-container').child[0]
        assert.equal('invalid-organization-field-length', message.attr.error)
      }
      return req.route.api.post(req, res)
    })

    it('should create organization', async () => {
      const owner = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/create-organization`, 'POST')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'org-name',
        email: 'test@test.com'
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        const messageContainer = doc.getElementById('message-container')
        assert.notEqual(null, messageContainer)
        assert.notEqual(null, messageContainer.child)
        const message = messageContainer.child[0]
        assert.equal('success', message.attr.error)
      }
      return req.route.api.post(req, res)
    })
  })
})
