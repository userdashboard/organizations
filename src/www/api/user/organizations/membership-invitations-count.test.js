/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/membership-invitations-count', async () => {
  describe('AccountSessionsCount#GET', () => {
    it('should count membership\' invitations', async () => {
      const user = await TestHelper.createUser()
      for (let i = 0, len = 3; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
        await TestHelper.acceptInvitation(user, owner)
        await TestHelper.createMembership(user, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/membership-invitations-count?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const result = await req.route.api.get(req)
      assert.equal(result, 3)
    })
  })
})
