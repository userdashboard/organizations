/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/organization-memberships-count', async () => {
  describe('OrganizationMembershipsCount#GET', () => {
    it('should count organization\'s memberships', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user1 = await TestHelper.createUser()
      await TestHelper.createMembership(user1, owner)
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships-count?organizationid=${owner.organization.organizationid}`)
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.get(req)
      assert.strictEqual(result, 2)
    })
  })
})
