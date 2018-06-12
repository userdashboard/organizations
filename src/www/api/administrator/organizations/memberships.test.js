/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/memberships', () => {
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

    it('should enforce page size', async () => {
      const administrator = await TestHelper.createAdministrator()
      for (let i = 0, len = 20; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createOrganization(user)
        await TestHelper.createMembership(user, user.organization.organizationid)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      global.PAGE_SIZE = 8
      const membershipsNow = await req.route.api.get(req)
      assert.equal(membershipsNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const administrator = await TestHelper.createAdministrator()
      const memberships = [ ]
      for (let i = 0, len = 30; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createOrganization(user)
        await TestHelper.createMembership(user, user.organization.organizationid)
        memberships.unshift(user.membership)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships?offset=10', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const membershipsNow = await req.route.api.get(req)
      for (let i = 0, len = 10; i < len; i++) {
        assert.equal(membershipsNow[i].membershipid, memberships[10 + i].membershipid)
      }
    })
  })
})
