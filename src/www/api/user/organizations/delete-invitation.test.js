/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/delete-invitation', async () => {
  it('should require a user', TestHelper.requireAccount('/api/user/organizations/delete-invitation'))
  it('should require an invitationid', TestHelper.requireParameter('/api/user/organizations/delete-invitation', 'invitationid'))
  describe('DeleteInvitation#DELETE', () => {
    it('should require owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
      req.account = user.account
      req.session = user.session
      try {
        await req.route.api.delete(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should reject accepted invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`, 'PATCH')
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code
      }
      await req.route.api.patch(req)
      await TestHelper.completeAuthorization(req)
      await req.route.api.patch(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
      req2.account = owner.account
      req2.session = owner.session
      try {
        await req2.route.api.delete(req2)
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation')
      }
    })

    it('should lock session for authorization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`, 'POST')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        code: 'this-is-the-code'
      }
      await req.route.api.post(req)
      assert.equal(req.session.lockURL, `/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`)
    })

    it('should delete invitation with authorization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.delete(req)
      await TestHelper.completeAuthorization(req)
      await req.route.api.delete(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req2.account = owner.account
      req2.session = owner.session
      try {
        await req2.route.api.get(req2)
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation')
      }
    })
  })
})
