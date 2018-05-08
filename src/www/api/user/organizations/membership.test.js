/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/membership', () => {
  it('should require an membershipid', TestHelper.requireParameter('/api/user/organizations/membership', 'membershipid'))
  describe('Membership#GET', () => {
    it('should allow organization owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const membership = await req.route.api.get(req)
      assert.notEqual(membership, null)
      assert.notEqual(membership.membershipid, null)
    })

    it('should allow organization member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user2.membership.membershipid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const membership = await req.route.api.get(req)
      assert.notEqual(membership, null)
      assert.notEqual(membership.membershipid, null)
    })

    it('should reject non-owner non-members', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = user2.account
      req.session = user2.session
      try {
        await req.route.api.get(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should return membership data', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const membership = await req.route.api.get(req)
      assert.notEqual(membership, null)
      assert.notEqual(membership.membershipid, null)
    })
  })
})
