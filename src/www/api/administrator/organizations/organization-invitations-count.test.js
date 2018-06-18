/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/administrator/organizations/organization-invitations-count', async () => {
  describe('OrganizationInvitationsCount#GET', () => {
    it('should count organization\'s invitations', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      await TestHelper.createInvitation(owner2, owner2.organization.organizationid)
      await TestHelper.createInvitation(owner2, owner2.organization.organizationid)
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-invitations-count?organizationid=${owner2.organization.organizationid}`, 'GET')
      req.account = req.administrator = administrator.account
      req.session = req.administratorSession = administrator.session
      const result = await req.route.api.get(req)
      assert.equal(result, 2)
    })
  })
})
