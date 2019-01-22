/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/account/organizations/create-organization`, async () => {
  describe('CreateOrganization#GET', () => {
    it('should present the form', async () => {
      const owner = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/create-organization`)
      req.account = owner.account
      req.session = owner.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      assert.strictEqual(doc.getElementById('submit-form').tag, 'form')
      assert.strictEqual(doc.getElementById('submit-button').tag, 'button')
    })
  })

  describe('CreateOrganization#POST', () => {
    it('should reject missing name', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: ''
      }
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-organization-name')

    })

    it('should enforce name length', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: '1'
      }
      global.minimumOrganizationNameLength = 2
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-organization-name-length')
      // too long
      const req2 = TestHelper.createRequest('/account/organizations/create-organization')
      req2.account = user.account
      req2.session = user.session
      req2.body = {
        name: '1234567890'
      }
      global.maximumOrganizationNameLength = 1
      const page2 = await req2.post(req2)
      const doc2 = TestHelper.extractDoc(page2)
      const message2 = doc2.getElementById('message-container').child[0]
      assert.strictEqual(message2.attr.template, 'invalid-organization-name-length')
    })

    it('should reject missing email', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization')
      req.session = user.session
      req.account = user.account
      req.body = {
        name: 'org-name',
        email: null
      }
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-organization-email')

    })

    it('should create organization', async () => {
      const owner = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/create-organization`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'org-name',
        email: 'test@test.com'
      }
      const page = await req.post(req)
      const redirectURL = await TestHelper.extractRedirectURL(page)
      assert.strictEqual(true, redirectURL.startsWith(`/account/organizations/organization?organizationid=`))
    })
  })
})
