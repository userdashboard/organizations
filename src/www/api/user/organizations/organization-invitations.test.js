/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/organization-invitations`, () => {
  describe('OrganizationInvitations#GET', () => {
    it('should require organization owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`)
      req.account = user.account
      req.session = user.session
      const invitations = await req.get(req)
      assert.strictEqual(invitations.message, 'invalid-account')
    })

    it('should limit invitation list to one page', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      const invitations = await req.get(req)
      assert.strictEqual(invitations.length, global.pageSize)
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      const invitations = await req.get(req)
      assert.strictEqual(invitations.length, global.pageSize)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const invitations = []
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
        invitations.unshift(owner.invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}&offset=${offset}`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[offset + i].invitationid)
      }
    })

    it('should enforce specified offset', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const invitations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
        invitations.unshift(owner.invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}&all=true`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[i].invitationid)
      }
    })
  })
})
