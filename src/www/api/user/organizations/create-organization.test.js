/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/create-organization`, () => {
  describe('CreateOrganization#POST', () => {
    it('should reject missing name', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${user.account.accountid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        name: '',
        email: user.profile.email
      }
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-organization-name')
    })

    it('should enforce name length', async () => {
      const owner = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: '12345',
        email: owner.profile.email
      }
      global.minimumOrganizationNameLength = 100
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-organization-name-length')
      global.maximumOrganizationNameLength = 1
      errorMessage = null
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-organization-name-length')
    })

    it('should reject missing email', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${user.account.accountid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        name: user.profile.firstName,
        email: null
      }
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-organization-email')
    })

    it('should create organization', async () => {
      const owner = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'this is the name',
        email: 'this@address.com'
      }
      const organization = await req.post(req)
      assert.strictEqual(organization.object, 'organization')
    })
  })
})
