/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/account/organizations/create-organization', () => {
  describe('CreateOrganization#GET', () => {
    it('should present the form', async () => {
      const owner = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization')
      req.account = owner.account
      req.session = owner.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
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
        name: '',
        email: 'org@email.com'
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-organization-name')
    })

    it('should enforce name length', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: '1',
        email: 'org@email.com',
        'display-name': 'administrator',
        'display-email': 'org-admin@email.com'
      }
      global.minimumOrganizationNameLength = 2
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-organization-name-length')
      const req2 = TestHelper.createRequest('/account/organizations/create-organization')
      req2.account = user.account
      req2.session = user.session
      req2.body = {
        name: '1234567890',
        email: 'org@email.com'
      }
      global.maximumOrganizationNameLength = 1
      const result2 = await req2.post(req2)
      const doc2 = TestHelper.extractDoc(result2.html)
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
        email: '',
        'display-name': 'administrator',
        'display-email': 'org-admin@email.com'
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-organization-email')
    })

    it('should accept valid existing profile', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(owner, {
        'display-name': 'Person',
        'display-email': 'person@email.com'
      })
      const req = TestHelper.createRequest('/account/organizations/create-organization')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'org-name',
        email: 'test@test.com',
        profileid: owner.profile.profileid
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should create organization (screenshots)', async () => {
      const owner = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/create-organization')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'org-name',
        email: 'test@test.com',
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      }
      req.filename = __filename
      req.screenshots = [
        { hover: '#account-menu-container' },
        { click: '/account/organizations' },
        { click: '/account/organizations/create-organization' },
        { fill: '#submit-form' }
      ]
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'success')
    })
  })
})
