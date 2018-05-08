/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/user/organizations/memberships`, () => {
  it('should require an organizationid', TestHelper.requireParameter(`/api/user/organizations/memberships`, 'organizationid'))
  describe('Memberships#GET', () => {
    it('should allow organization owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const memberships = await req.route.api.get(req)
      assert.equal(memberships.length, 1)
      assert.equal(memberships[0].membershipid, user.membership.membershipid)
    })

    it('should allow organization member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = user2.account
      req.session = user2.session
      const memberships = await req.route.api.get(req)
      assert.equal(memberships.length, 2)
      assert.equal(memberships[0].membershipid, user2.membership.membershipid)
      assert.equal(memberships[1].membershipid, user.membership.membershipid)
    })

    it('should reject non-owner non-members', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = user2.account
      req.session = user2.session
      try {
        await req.route.api.get(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should return membership list', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const memberships = await req.route.api.get(req)
      assert.equal(memberships.length, 1)
      assert.equal(memberships[0].membershipid, user.membership.membershipid)
    })
  })
})
