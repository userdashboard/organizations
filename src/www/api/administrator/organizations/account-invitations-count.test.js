/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/account-invitations-count', async () => {
  describe('AccountInvitationsCount#GET', () => {
    it('should count account\'s invitations', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      for (let i = 0, len = 3; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
        await TestHelper.acceptInvitation(user, owner)
        await TestHelper.createMembership(user, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-invitations-count?accountid=${user.account.accountid}`, 'GET')
      req.account = req.administrator = administrator.account
      req.session = req.administratorSession = administrator.session
      const result = await req.route.api.get(req)
      assert.equal(result, 3)
    })
  })
})
