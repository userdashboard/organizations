/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/memberships-count', async () => {
  describe('MembershipsCount#GET', () => {
    it('should count memberships', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      await TestHelper.createMembership(user, owner2.organization.organizationid)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      await TestHelper.createMembership(user, owner3.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/memberships-count?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const result = await req.route.api.get(req)
      assert.equal(result, 3)
    })
  })
})
