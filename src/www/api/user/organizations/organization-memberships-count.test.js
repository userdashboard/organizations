/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/organization-memberships-count', async () => {
  describe('OrganizationMembershipsCount#GET', () => {
    it('should count organization\'s memberships', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user1 = await TestHelper.createUser()
      await TestHelper.createMembership(user1, owner)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/organization-memberships-count?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const result = await req.route.api.get(req)
      assert.equal(result, 2)
    })
  })
})
