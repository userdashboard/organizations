/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/user/organizations/invitations`, () => {
  describe('Invitations#GET', () => {
    it('should require organization owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = user.account
      req.session = user.session
      try {
        await req.route.api.get(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should return invitation list', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const invitations = await req.route.api.get(req)
      assert.equal(invitations.length, 1)
      assert.equal(invitations[0].invitationid, owner.invitation.invitationid)
    })
  })
})
