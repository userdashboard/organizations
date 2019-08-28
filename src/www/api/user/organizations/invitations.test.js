/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/invitations`, () => {
  describe('Invitations#GET', () => {
    it('should limit invitation list to one page', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const invitations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
        invitations.unshift(owner.invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[i].invitationid)
      }
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get(req)
      assert.strictEqual(invitationsNow.length, global.pageSize)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const invitations = []
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        const invitation = await TestHelper.createInvitation(owner)
        invitations.unshift(invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}&offset=${offset}`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[offset + i].invitationid)
      }
    })

    it('should return all records', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const invitations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const invitation = await TestHelper.createInvitation(owner)
        invitations.unshift(invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}&all=true`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[i].invitationid)
      }
    })
  })
})
