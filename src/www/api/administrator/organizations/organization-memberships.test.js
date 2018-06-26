/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/administrator/organizations/organization-memberships`, () => {
  describe('OrganizationMembership#GET', () => {
    it('should limit membership list to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const memberships = []
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
        memberships.push(user.membership)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const membershipsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(membershipsNow[i].codeid, memberships[i].codeid)
      }
    })

    it('should enforce page size', async () => {
      global.PAGE_SIZE = 3
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const membershipsNow = await req.route.api.get(req)
      assert.equal(membershipsNow.length, global.PAGE_SIZE)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      const memberships = []
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = global.PAGE_SIZE + offset + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner)
        memberships.unshift(user.membership)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}&offset=${offset}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const membershipsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(membershipsNow[i].membershipid, memberships[offset + i].membershipid)
      }
    })
  })
})
