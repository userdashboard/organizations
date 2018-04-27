/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/administrator/organizations/invitations`, () => {
  it('should require an administrator', TestHelper.requireAdministrator(`/api/administrator/organizations/invitations`))
  describe('Invitations#GET', () => {
    it('should return invitation list', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      await TestHelper.createInvitation(owner2, owner2.organization.organizationid)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      await TestHelper.createInvitation(owner3, owner3.organization.organizationid)
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitations`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const invitations = await req.route.api.get(req)
      assert.equal(true, invitations.length >= 3)
      assert.equal(invitations[0].invitationid, owner3.invitation.invitationid)
      assert.equal(invitations[1].invitationid, owner2.invitation.invitationid)
      assert.equal(invitations[2].invitationid, owner.invitation.invitationid)
    })

    it('should filter by organizationid', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      await TestHelper.createInvitation(owner2, owner2.organization.organizationid)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      await TestHelper.createInvitation(owner3, owner3.organization.organizationid)
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitations?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const invitations = await req.route.api.get(req)
      assert.equal(invitations.length, 1)
      assert.equal(invitations[0].invitationid, owner.invitation.invitationid)
    })
  })
})
