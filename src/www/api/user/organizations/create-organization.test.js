/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/create-organization', () => {
  it('should require a user', TestHelper.requireAccount('/api/user/organizations/create-organization'))
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
      try {
        await req.route.api.post(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization-name-length')
      } finally {
        global.MINIMUM_ORGANIZATION_NAME_LENGTH = 1
      }
      global.MAXIMUM_ORGANIZATION_NAME_LENGTH = 1
      try {
        await req.route.api.post(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization-name-length')
      } finally {
        global.MAXIMUM_ORGANIZATION_NAME_LENGTH = 100
      }
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
      try {
        await req.route.api.post(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization-field')
      }
    })

    it('should create an organization', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/api/user/organizations/create-organization', 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: 'this is the name',
        email: 'this@address.com'
      }
      await req.route.api.post(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${req.account.accountid}`, 'GET')
      req2.account = req.account
      req2.session = req.session
      const organizationsNow = await req2.route.api.get(req2)
      assert.notEqual(organizationsNow, null)
      assert.equal(organizationsNow.length, 1)
    })
  })
})
