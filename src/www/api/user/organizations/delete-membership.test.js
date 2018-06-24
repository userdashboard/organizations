/* eslint-env mocha */
const assert = require('assert')
const orgs = require('../../../../../index.js')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/delete-membership', async () => {
  describe('DeleteMembership#DELETE', () => {
    it('should reject non-owner non-member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/delete-membership?membershipid=${user.membership.membershipid}`, 'DELETE')
      req.account = user2.account
      req.session = user2.session
      let errorMessage
      try {
        await req.route.api.delete(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-account')
    })

    it('should delete membership', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-membership?membershipid=${user.membership.membershipid}`, 'DELETE')
      req.account = user.account
      req.session = user.session
      await req.route.api.delete(req)
      req.session = await TestHelper.unlockSession(user)
      await req.route.api.delete(req)
      let errorMessage
      try {
        await orgs.Membership.load(user.membership.membershipid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })
  })
})
