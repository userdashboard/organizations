/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/invitations-count', async () => {
  describe('InvitationsCount#GET', () => {
    it('should count invitations', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      await TestHelper.createInvitation(owner)
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/invitations-count?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      const result = await req.get(req)
      assert.strictEqual(result, 3)
    })
  })
})
