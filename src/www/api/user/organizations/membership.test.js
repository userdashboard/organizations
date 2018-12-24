/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/membership', () => {
  describe('Membership#GET', () => {
    it('should allow organization owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = owner.account
      req.session = owner.session
      const membership = await req.get(req)
      assert.strictEqual(membership.object, 'membership')
    })

    it('should allow organization member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user2.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const membership = await req.get(req)
      assert.strictEqual(membership.object, 'membership')
    })

    it('should reject non-owner non-members', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = user2.account
      req.session = user2.session
      const membership = await req.get(req)
      assert.strictEqual(membership.message, 'invalid-account')
    })

    it('should return membership data', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const membership = await req.get(req)
      assert.strictEqual(membership.object, 'membership')
    })
  })
})
