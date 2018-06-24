/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/create-membership`, () => {
  describe('CreateMembership#POST', () => {
    it('should enforce code length', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        code: '1'
      }
      global.MINIMUM_INVITATION_CODE_LENGTH = 100
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitation-code-length')
    })

    it('should reject a used invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        req.session = await TestHelper.unlockSession(user)
        await req.route.api.post(req)
        const user2 = await TestHelper.createUser()
        const req2 = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`, 'POST')
        req2.account = user2.account
        req2.session = user2.session
        req2.body = {
          code: owner.invitation.code
        }
        const res2 = TestHelper.createResponse()
        res2.end = async (str) => {
          const json = JSON.parse(str)
          assert.equal(json.error, 'invalid-invitation')
        }
        return req2.route.api.post(req2, res2)
      }
      return req.route.api.post(req, res)
    })

    it('should reject owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`, 'POST')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        code: owner.invitation.code
      }
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-account')
    })

    it('should reject existing members', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code
      }
      let errorMessage
      try {
        await req.route.api.post(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-account')
    })

    it('should create authorized membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code
      }
      await req.route.api.post(req)
      req.session = await TestHelper.unlockSession(user)
      const membership = await req.route.api.post(req)
      assert.notEqual(membership, null)
      assert.notEqual(membership.membershipid, null)
    })
  })
})
