/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/memberships-count', async () => {
  describe('MembershipsCount#GET', () => {
    it('should count memberships', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user1 = await TestHelper.createUser()
      await TestHelper.createMembership(user1, owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner2)
      const user3 = await TestHelper.createUser()
      await TestHelper.createMembership(user3, owner2)
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships-count', 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const result = await req.route.api.get(req)
      assert.equal(result, 3)
    })
  })
})
