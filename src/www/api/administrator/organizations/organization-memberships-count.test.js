/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/organization-memberships-count', async () => {
  describe('OrganizationMembershipsCount#GET', () => {
    it('should count organization\'s memberships', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createMembership(owner, owner.organization.organizationid)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      await TestHelper.createMembership(owner2, owner2.organization.organizationid)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner2.organization.organizationid)
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships-count?organizationid=${owner2.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.route.api.get(req)
      assert.equal(result, 2)
    })
  })
})
