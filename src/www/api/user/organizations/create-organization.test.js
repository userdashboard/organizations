/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/create-organization', () => {
  describe('CreateOrganization#POST', () => {
    it('should enforce name length', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/api/user/organizations/create-organization', 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: '12345'
      }
      global.MINIMUM_ORGANIZATION_NAME_LENGTH = 100
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization-name-length')
      global.MAXIMUM_ORGANIZATION_NAME_LENGTH = 1
      errorMessage = null
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization-name-length')
    })

    it('should reject invalid fields', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest('/api/user/organizations/create-organization', 'POST')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'name',
        firstName: 'field'
      }
      global.ORGANIZATION_FIELDS = ['email']
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization-field')
    })

    it('should create authorized organization', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/api/user/organizations/create-organization', 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: 'this is the name',
        email: 'this@address.com'
      }
      await req.route.api.post(req)
      await TestHelper.completeAuthorization(req)
      const organization = await req.route.api.post(req)
      assert.notEqual(null, organization)
      assert.notEqual(null, organization.organizationid)
    })
  })
})
