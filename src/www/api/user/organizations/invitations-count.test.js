/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/invitations-count', async () => {
  describe('InvitationsCount#GET', () => {
    it('should count invitations', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/invitations-count?accountid=${owner.account.accountid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const result = await req.route.api.get(req)
      assert.equal(result, 3)
    })
  })
})
