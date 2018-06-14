/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/administrator/organizations/organization-memberships`, () => {
  describe('OrganizationMembership#GET', () => {
    it('should return membership list', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createMembership(owner, owner.organization.organizationid)
      await TestHelper.createMembership(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const memberships = await req.route.api.get(req)
      assert.equal(memberships.length, 2)
    })

    it('should enforce page size', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = 10; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      global.PAGE_SIZE = 8
      const membershipsNow = await req.route.api.get(req)
      assert.equal(membershipsNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      const memberships = []
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = 10; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner.organization.organizationid)
        memberships.unshift(user.membership)
      }
      const offset = 3
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}&offset=${offset}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const membershipsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(membershipsNow[i].membershipid, memberships[offset + i].membershipid)
      }
    })
  })
})
