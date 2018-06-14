/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/administrator/organizations/invitations`, () => {
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
      assert.equal(3, invitations.length)
      assert.equal(invitations[0].invitationid, owner3.invitation.invitationid)
      assert.equal(invitations[1].invitationid, owner2.invitation.invitationid)
      assert.equal(invitations[2].invitationid, owner.invitation.invitationid)
    })

    it('should enforce page size', async () => {
      const administrator = await TestHelper.createAdministrator()
      for (let i = 0, len = 10; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createOrganization(user)
        await TestHelper.createInvitation(user, user.organization.organizationid)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/invitations', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      global.PAGE_SIZE = 8
      const invitationsNow = await req.route.api.get(req)
      assert.equal(invitationsNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const administrator = await TestHelper.createAdministrator()
      const invitations = [ ]
      for (let i = 0, len = 10; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createOrganization(user)
        await TestHelper.createInvitation(user, user.organization.organizationid)
        invitations.unshift(user.invitation)
      }
      const offset = 3
      const req = TestHelper.createRequest('/api/administrator/organizations/invitations?offset=3', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const invitationsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(invitationsNow[i].invitationid, invitations[offset + i].invitationid)
      }
    })
  })
})
