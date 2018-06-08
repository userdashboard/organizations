/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/invitations-count', async () => {
  describe('InvitationsCount#GET', () => {
    it('should count invitations', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      await TestHelper.createInvitation(owner2, owner2.organization.organizationid)
      await TestHelper.createInvitation(owner2, owner2.organization.organizationid)
      const req = TestHelper.createRequest('/api/administrator/organizations/invitations-count', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.route.api.get(req)
      assert.equal(result, 3)
    })
  })
})
