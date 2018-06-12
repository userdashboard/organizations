/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/account-memberships-count', async () => {
  describe('AccountMembershipsCount#GET', () => {
    it('should count account\'s memberships', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      await TestHelper.createMembership(user, owner2.organization.organizationid)
      await TestHelper.createMembership(user, owner2.organization.organizationid)
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-memberships-count?accountid=${user.account.accountid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.route.api.get(req)
      assert.equal(result, 3)
    })
  })
})
