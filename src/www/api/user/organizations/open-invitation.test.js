/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/open-invitation', () => {
  describe('Invitation#GET', () => {
    it('should reject accepted invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const user = await TestHelper.createUser()
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/open-invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const json = JSON.parse(str)
        assert.equal(json.error, 'invalid-invitation')
      }
      return req.route.api.get(req, res)
    })

    it('should return invitation and organization data', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/open-invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const data = await req.route.api.get(req)
      const invitation = data.invitation
      assert.notEqual(invitation, null)
      assert.notEqual(invitation.invitationid, null)
    })

    it('should redact invitation code', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/open-invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const data = await req.route.api.get(req)
      const invitation = data.invitation
      assert.notEqual(invitation, null)
      assert.notEqual(invitation.invitationid, null)
      assert.equal(invitation.code, null)
    })
  })
})
