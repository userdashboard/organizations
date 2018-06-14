/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/administrator/organizations/account-invitations`, () => {
  describe('Invitations#GET', () => {
    it('should return account\'s invitation list', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      for (let i = 0, len = 3; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
        await TestHelper.acceptInvitation(user, owner)
        await TestHelper.createMembership(user, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-invitations?accountid=${user.account.accountid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const invitations = await req.route.api.get(req)
      assert.equal(3, invitations.length)
    })

    it('should enforce page size', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      for (let i = 0, len = 10; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
        await TestHelper.acceptInvitation(user, owner)
        await TestHelper.createMembership(user, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-invitations?accountid=${user.account.accountid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      global.PAGE_SIZE = 8
      const invitationsNow = await req.route.api.get(req)
      assert.equal(invitationsNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      const invitations = []
      for (let i = 0, len = 10; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
        await TestHelper.acceptInvitation(user, owner)
        await TestHelper.createMembership(user, owner.organization.organizationid)
        invitations.unshift(user.invitation)
      }
      const offset = 3
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-invitations?accountid=${user.account.accountid}&offset=${offset}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const invitationsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(invitationsNow[i].invitationid, invitations[offset + i].invitationid)
      }
    })
  })
})
