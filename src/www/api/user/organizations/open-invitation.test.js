/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/open-invitation', () => {
  describe('OpenInvitation#GET', () => {
    it('should reject accepted invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/open-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      const invitation = await req.get(req)
      assert.strictEqual(invitation.message, 'invalid-invitation')
    })

    it('should return invitation data', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/open-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      const invitation = await req.get(req)
      assert.strictEqual(invitation.object, 'invitation')
    })

    it('should redact invitation code', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/open-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      const invitation = await req.get(req)
      assert.strictEqual(invitation.code, undefined)
    })
  })
})
