/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/delete-invitation', async () => {
  describe('DeleteInvitation#DELETE', () => {
    it('should require owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.route.api.delete(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization')
    })

    it('should reject accepted invitation', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      let errorMessage
      try {
        await req.route.api.delete(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitation')
    })

    it('should delete invitation with authorization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.delete(req)
      req.session = await TestHelper.unlockSession(owner)
      await req.route.api.delete(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req2.account = owner.account
      req2.session = owner.session
      let errorMessage
      try {
        await req2.route.api.get(req2)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })
  })
})
