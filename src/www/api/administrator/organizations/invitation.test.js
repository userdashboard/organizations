/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/invitation', () => {
  it('should require an invitationid', TestHelper.requireParameter('/api/administrator/organizations/invitation', 'invitationid'))
  describe('Invitation#GET', () => {
    it('should return invitation data', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const invitation = await req.route.api.get(req)
      assert.notEqual(invitation, null)
      assert.notEqual(invitation.invitationid, null)
    })

    it('should redact invitation code', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const invitation = await req.route.api.get(req)
      assert.notEqual(invitation, null)
      assert.notEqual(invitation.invitationid, null)
      assert.equal(invitation.code, null)
    })
  })
})
