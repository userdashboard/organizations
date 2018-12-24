/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/invitations-count', async () => {
  describe('InvitationsCount#GET', () => {
    it('should count invitations', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2, { email: owner2.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner2)
      await TestHelper.createInvitation(owner2)
      const req = TestHelper.createRequest('/api/administrator/organizations/invitations-count')
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.get(req)
      assert.strictEqual(result, 3)
    })
  })
})
