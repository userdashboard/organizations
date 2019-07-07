/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/create-membership`, () => {
  describe('CreateMembership#POST', () => {
    it('should enforce code length', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        code: '1',
        email: user.profile.email,
        name: user.profile.firstName
      }
      global.minimumInvitationCodeLength = 100
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-invitation-code-length')
    })

    it('should reject a used invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      await TestHelper.acceptInvitation(user, owner)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
      req.account = user2.account
      req.session = user2.session
      req.body = {
        code: owner.invitation.code,
        email: user2.profile.email,
        name: user2.profile.firstName
      }
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-invitation')
    })

    it('should reject owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        code: owner.invitation.code,
        email: owner.profile.email,
        name: owner.profile.firstName
      }
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should reject existing members', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code,
        email: user.profile.email,
        name: user.profile.firstName
      }
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should create authorized membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code,
        email: user.profile.email,
        name: user.profile.firstName
      }
      const membership = await req.post(req)
      assert.strictEqual(membership.object, 'membership')
    })
  })
})
