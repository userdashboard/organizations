/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/memberships', () => {
  it('should require an administrator', TestHelper.requireAdministrator('/api/administrator/organizations/memberships'))
  describe('Memberships#GET', () => {
    it('should return membership list', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createMembership(owner, owner.organization.organizationid)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      await TestHelper.createMembership(owner2, owner2.organization.organizationid)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      await TestHelper.createMembership(owner3, owner3.organization.organizationid)
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const memberships = await req.route.api.get(req)
      assert.equal(true, memberships.length >= 3)
      assert.equal(memberships[0].membershipid, owner3.membership.membershipid)
      assert.equal(memberships[1].membershipid, owner2.membership.membershipid)
      assert.equal(memberships[2].membershipid, owner.membership.membershipid)
    })

    it('should filter by organizationid', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      await TestHelper.createMembership(owner2, owner.organization.organizationid)
      await TestHelper.createMembership(owner3, owner2.organization.organizationid)
      await TestHelper.createMembership(owner, owner3.organization.organizationid)
      const req = TestHelper.createRequest(`/api/administrator/organizations/memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const memberships = await req.route.api.get(req)
      assert.equal(memberships.length, 1)
      assert.equal(memberships[0].membershipid, owner2.membership.membershipid)
    })
  })
})
