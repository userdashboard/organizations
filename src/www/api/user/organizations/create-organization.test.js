/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/create-organization`, () => {
  describe('CreateOrganization#POST', () => {
    it('should reject missing name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = [ 'display-name', 'display-email' ]
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: '',
        email: owner.profile.contactEmail,
        profileid: owner.profile.profileid
      }
      let errorMessage
      try {
        await req.post()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-organization-name')
    })

    it('should enforce name length', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'Sales',
        email: owner.profile.contactEmail,
        profileid: owner.profile.profileid
      }
      global.minimumOrganizationNameLength = 100
      let errorMessage
      try {
        await req.post()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-organization-name-length')
      global.maximumOrganizationNameLength = 1
      errorMessage = null
      try {
        await req.post()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-organization-name-length')
    })

    it('should reject missing email', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail,
        profileid: owner.profile.profileid
      })
      const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'Family',
        email: null,
        profileid: owner.profile.profileid
      }
      let errorMessage
      try {
        await req.post()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-organization-email')
    })

    it('should reject invalid profileid', async () => {
      const owner = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'this is the name',
        email: 'this@address.com',
        profileid: 'invalid'
      }
      let errorMessage
      try {
        await req.post()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-profileid')
    })

    it('should reject profile missing fields', async () => {
      const owner = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'this is the name',
        email: 'this@address.com',
        profileid: owner.profile.profileid
      }
      let errorMessage
      try {
        await req.post()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-profile')
    })

    it('should create organization', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'this is the name',
        email: 'this@address.com',
        profileid: owner.profile.profileid
      }
      const organization = await req.post()
      assert.strictEqual(organization.object, 'organization')
    })
  })
})
