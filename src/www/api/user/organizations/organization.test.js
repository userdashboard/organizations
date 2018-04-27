/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/organization', () => {
  it('should require a user', TestHelper.requireAccount('/api/user/organizations/organization'))
  it('should require an organizationid', TestHelper.requireParameter('/api/user/organizations/organization', 'organizationid'))
  describe('Organization#GET', () => {
    it('should allow organization owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/organization?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const organization = await req.route.api.get(req)
      assert.notEqual(organization, null)
      assert.notEqual(organization.organizationid, null)
    })

    it('should allow organization member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const organization = await req.route.api.get(req)
      assert.notEqual(organization, null)
      assert.notEqual(organization.organizationid, null)
    })

    it('should reject non-owner non-members', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/organization?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = user2.account
      req.session = user2.session
      try {
        await req.route.api.get(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should return organization data', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/organization?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const organization = await req.route.api.get(req)
      assert.notEqual(organization, null)
      assert.notEqual(organization.organizationid, null)
    })
  })
})
