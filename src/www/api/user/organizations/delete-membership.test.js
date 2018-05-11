/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/delete-membership', async () => {
  describe('DeleteMembership#DELETE', () => {
    it('should reject non-owner non-member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/delete-membership?membershipid=${user.membership.membershipid}`, 'DELETE')
      req.account = user2.account
      req.session = user2.session
      try {
        await req.route.api.delete(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-account')
      }
    })

    it('should delete membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-membership?membershipid=${user.membership.membershipid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.delete(req)
      await TestHelper.completeAuthorization(req)
      await req.route.api.delete(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req2.account = owner.account
      req2.session = owner.session
      try {
        await req2.route.api.get(req2)
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })
  })
})
