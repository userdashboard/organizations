/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/account-memberships-count', async () => {
  describe('AccountMembershipsCount#GET', () => {
    it('should count account\'s memberships', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      await TestHelper.createMembership(user, owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2, { email: owner2.profile.contactEmail, name: 'My organization' })
      await TestHelper.createMembership(user, owner2)
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-memberships-count?accountid=${user.account.accountid}`)
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.get(req)
      assert.strictEqual(result, 2)
    })
  })
})
