/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/organizations-count', async () => {
  describe('OrganizationsCount#GET', () => {
    it('should count organizations', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await TestHelper.createOrganization(user)
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2)
      const req = TestHelper.createRequest('/api/administrator/organizations/organizations-count', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.route.api.get(req)
      assert.equal(result, 3)
    })
  })
})
