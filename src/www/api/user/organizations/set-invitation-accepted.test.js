/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/user/organizations/set-invitation-accepted`, () => {
  describe('SetInvitationAccepted#POST', () => {
    it('should enforce code length', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/set-invitation-accepted?invitationid=${owner.invitation.invitationid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        code: '1'
      }
      global.MINIMUM_INVITATION_CODE_LENGTH = 100
      let errorMessage
      try {
        await req.route.api.patch(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitation-code-length')
    })

    it('should reject a used invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/set-invitation-accepted?invitationid=${owner.invitation.invitationid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        await TestHelper.completeAuthorization(req)
        await req.route.api.patch(req)
        const user2 = await TestHelper.createUser()
        const req2 = TestHelper.createRequest(`/api/user/organizations/set-invitation-accepted?invitationid=${owner.invitation.invitationid}`, 'POST')
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
        return req2.route.api.patch(req2, res2)
      }
      return req.route.api.patch(req, res)
    })

    it('should reject owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const invitation1 = owner.invitation
      const req = TestHelper.createRequest(`/api/user/organizations/set-invitation-accepted?invitationid=${invitation1.invitationid}`, 'POST')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        code: owner.invitation.code
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const json = JSON.parse(str)
        assert.equal(json.error, 'invalid-account')
      }
      return req.route.api.patch(req, res)
    })

    it('should reject existing members', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const invitation1 = owner.invitation
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/set-invitation-accepted?invitationid=${invitation1.invitationid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        await TestHelper.completeAuthorization(req)
        await req.route.api.patch(req)
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
        const invitation2 = owner.invitation
        const req2 = TestHelper.createRequest(`/api/user/organizations/set-invitation-accepted?invitationid=${invitation2.invitationid}`, 'POST')
        req2.account = req.account
        req2.session = req.session
        req2.body = {
          code: owner.invitation.code
        }
        const res2 = TestHelper.createResponse()
        res2.end = async (str) => {
          const json = JSON.parse(str)
          assert.equal(json.error, 'invalid-account')
        }
        return req2.route.api.patch(req2, res2)
      }
      return req.route.api.patch(req, res)
    })

    it('should create authorized membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/set-invitation-accepted?invitationid=${owner.invitation.invitationid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code
      }
      await req.route.api.patch(req)
      await TestHelper.completeAuthorization(req)
      const membership = await req.route.api.patch(req)
      assert.notEqual(membership, null)
      assert.notEqual(membership.membershipid, null)
    })
  })
})
