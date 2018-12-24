/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/invitation', () => {
  describe('Invitation#GET', () => {
    it('should reject non-owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.route.api.get(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should return invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = owner.account
      req.session = owner.session
      const invitation = await req.route.api.get(req)
      assert.strictEqual(invitation.object, 'invitation')
    })

    it('should redact invitation code', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = owner.account
      req.session = owner.session
      const invitation = await req.route.api.get(req)
      assert.strictEqual(invitation.cod, undefined)
    })
  })
})
