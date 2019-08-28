/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/account/organizations/edit-organization`, () => {
  describe('EditOrganization#BEFORE', () => {
    it('should require owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'Owner\'s organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user, { email: user.profile.contactEmail, name: 'User\'s organization' })
      const req = TestHelper.createRequest(`/account/organizations/edit-organization?organizationid=${owner.organization.organizationid}`)
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should bind organization to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const req = TestHelper.createRequest(`/account/organizations/edit-organization?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.organization.organizationid, owner.organization.organizationid)
    })
  })

  describe('EditOrganization#GET', () => {
    it('should present the form', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const req = TestHelper.createRequest(`/account/organizations/edit-organization?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      assert.strictEqual(doc.getElementById('submit-form').tag, 'form')
      assert.strictEqual(doc.getElementById('submit-button').tag, 'button')
    })
  })

  describe('EditOrganization#POST', () => {
    it('should reject missing name', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const req = TestHelper.createRequest(`/account/organizations/edit-organization?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: ''
      }
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-organization-name')
    })

    it('should enforce name length', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const req = TestHelper.createRequest(`/account/organizations/edit-organization?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: '1',
        email: owner.profile.contactEmail
      }
      global.minimumOrganizationNameLength = 2
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-organization-name-length')
      // too long
      global.maximumOrganizationNameLength = 1
      const req2 = TestHelper.createRequest(`/account/organizations/edit-organization?organizationid=${owner.organization.organizationid}`)
      req2.account = owner.account
      req2.session = owner.session
      req2.body = {
        name: '1234567890',
        email: owner.profile.contactEmail
      }
      const page2 = await req2.post(req2)
      const doc2 = TestHelper.extractDoc(page2)
      const message2 = doc2.getElementById('message-container').child[0]
      assert.strictEqual(message2.attr.template, 'invalid-organization-name-length')
    })

    it('should reject missing email', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const req = TestHelper.createRequest(`/account/organizations/edit-organization?organizationid=${owner.organization.organizationid}`)
      req.session = owner.session
      req.account = owner.account
      req.body = {
        name: 'org-name',
        email: null
      }
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-organization-email')
    })

    it('should apply organization update', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const req = TestHelper.createRequest(`/account/organizations/edit-organization?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        email: owner.profile.contactEmail,
        name: 'Organization name'
      }
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })
  })
})
