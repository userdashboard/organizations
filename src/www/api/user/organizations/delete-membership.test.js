/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/delete-membership', async () => {
  describe('DeleteMembership#BEFORE', () => {
    it('should reject non-owner non-member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/delete-membership?membershipid=${user.membership.membershipid}`, 'DELETE')
      req.account = user2.account
      req.session = user2.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })
  })

  describe('DeleteMembership#DELETE', () => {
    it('should delete membership', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-membership?membershipid=${user.membership.membershipid}`, 'DELETE')
      req.account = user.account
      req.session = user.session
      await req.delete(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`, 'DELETE')
      req2.account = req.account
      req2.session = req.session
      const membership = await req2.get(req2)
      assert.strictEqual(membership.message, 'invalid-membershipid')
    })
  })
})
