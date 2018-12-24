/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/administrator/organizations/invitations`, () => {
  describe('Invitations#GET', () => {
    it('should limit invitation list to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const invitations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
        invitations.unshift(owner.invitation)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitations`)
      req.account = administrator.account
      req.session = administrator.session
      const invitationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[i].invitationid)
      }
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const administrator = await TestHelper.createAdministrator()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createOrganization(user, { email: user.profile.email, name: 'My organization' })
        await TestHelper.createInvitation(user, user.organization.organizationid)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/invitations')
      req.account = administrator.account
      req.session = administrator.session
      const invitationsNow = await req.get(req)
      assert.strictEqual(invitationsNow.length, global.pageSize)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const invitations = [ ]
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createOrganization(user, { email: user.profile.email, name: 'My organization' })
        await TestHelper.createInvitation(user, user.organization.organizationid)
        invitations.unshift(user.invitation)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitations?offset=${offset}`)
      req.account = administrator.account
      req.session = administrator.session
      const invitationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[offset + i].invitationid)
      }
    })

    it('should return all records', async () => {
      const administrator = await TestHelper.createAdministrator()
      const invitations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createOrganization(user, { email: user.profile.email, name: 'My organization' })
        await TestHelper.createInvitation(user, user.organization.organizationid)
        invitations.unshift(user.invitation)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitations?all=true`)
      req.account = administrator.account
      req.session = administrator.session
      const invitationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[i].invitationid)
      }
    })
  })
})
