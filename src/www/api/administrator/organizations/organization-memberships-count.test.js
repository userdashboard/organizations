/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/organization-memberships-count', async () => {
  describe('OrganizationMembershipsCount#GET', () => {
    it('should count organization\'s memberships', async () => {
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
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships-count?organizationid=${owner2.organization.organizationid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const result = await req.route.api.get(req)
      assert.equal(result, 2)
    })
  })
})
