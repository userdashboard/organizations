/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/memberships-count', async () => {
  describe('MembershipsCount#GET', () => {
    it('should count memberships', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createMembership(owner, owner.organization.organizationid)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      await TestHelper.createMembership(owner2, owner2.organization.organizationid)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner2.organization.organizationid)
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships-count', 'GET')
      req.account = req.administrator = administrator.account
      req.session = req.administratorSession = administrator.session
      const result = await req.route.api.get(req)
      assert.equal(result, 3)
    })
  })
})
