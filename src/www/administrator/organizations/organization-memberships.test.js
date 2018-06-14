/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/administrator/organizations/organization-memberships`, () => {
  describe('OrganizationMemberships#BEFORE', () => {
    it('should bind memberships to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user1 = await TestHelper.createUser()
      await TestHelper.createMembership(user1, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.memberships, null)
      assert.equal(req.data.memberships.length, 2)
      assert.equal(req.data.memberships[0].membershipid, user2.membership.membershipid)
      assert.equal(req.data.memberships[1].membershipid, user1.membership.membershipid)
    })
  })

  describe('OrganizationMemberships#GET', () => {
    it('should have row for each membership', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user1 = await TestHelper.createUser()
      await TestHelper.createMembership(user1, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const membership1Row = doc.getElementById(user1.membership.membershipid)
        assert.notEqual(null, membership1Row)
        const membership2Row = doc.getElementById(user2.membership.membershipid)
        assert.notEqual(null, membership2Row)
      }
      return req.route.api.get(req, res)
    })

    it('should limit memberships to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = 10; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const table = doc.getElementById('memberships-table')
        const rows = table.getElementsByTagName('tr')
        assert.equal(rows.length, global.PAGE_SIZE + 1)
      }
      return req.route.api.get(req, res)
    })

    it('should enforce page size', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = 10; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      global.PAGE_SIZE = 8
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const table = doc.getElementById('memberships-table')
        const rows = table.getElementsByTagName('tr')
        assert.equal(rows.length, global.PAGE_SIZE + 1)
      }
      return req.route.api.get(req, res)
    })

    it('should enforce specified offset', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const memberships = []
      for (let i = 0, len = 10; i < len; i++) {
        const user = await TestHelper.createUser()
        const membership = await TestHelper.createMembership(user, owner.organization.organizationid)
        memberships.unshift(membership)
      }
      const offset = 3
      const req = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}&offset=${offset}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
          assert.notEqual(null, doc.getElementById(memberships[offset + i].membershipid))
        }
      }
      await req.route.api.get(req, res)
    })
  })
})
