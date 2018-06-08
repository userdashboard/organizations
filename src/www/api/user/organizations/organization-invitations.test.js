/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/user/organizations/organization-invitations`, () => {
  describe('OrganizationInvitations#GET', () => {
    it('should require organization owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.route.api.get(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization')
    })

    it('should return invitation list', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const invitations = await req.route.api.get(req)
      assert.equal(invitations.length, 1)
      assert.equal(invitations[0].invitationid, owner.invitation.invitationid)
    })

    it('should enforce page size', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = 20; i < len; i++) {
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      global.PAGE_SIZE = 8
      const invitationsNow = await req.route.api.get(req)
      assert.equal(invitationsNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const invitations = []
      for (let i = 0, len = 30; i < len; i++) {
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
        invitations.unshift(owner.invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}&offset=10`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.route.api.get(req)
      for (let i = 0, len = 10; i < len; i++) {
        assert.equal(invitationsNow[i].invitationid, invitations[10 + i].invitationid)
      }
    })
  })
})
