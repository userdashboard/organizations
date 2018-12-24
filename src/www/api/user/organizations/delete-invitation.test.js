/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/delete-invitation', async () => {
  describe('DeleteInvitation#BEFORE', () => {
    it('should require owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should reject accepted invitation', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-invitation')
    })
  })

  describe('DeleteInvitation#DELETE', () => {
    it('should delete invitation with authorization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      await req.delete(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req2.account = owner.account
      req2.session = owner.session
      const invitation = await req2.get(req2)
      assert.strictEqual(invitation.message, 'invalid-invitationid')
    })
  })
})
