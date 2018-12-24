/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/memberships-count', async () => {
  describe('MembershipsCount#GET', () => {
    it('should count memberships', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user1 = await TestHelper.createUser()
      await TestHelper.createMembership(user1, owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2, { email: owner2.profile.email, name: 'My organization' })
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner2)
      const user3 = await TestHelper.createUser()
      await TestHelper.createMembership(user3, owner2)
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships-count')
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.get(req)
      assert.strictEqual(result, 5)
    })
  })
})
