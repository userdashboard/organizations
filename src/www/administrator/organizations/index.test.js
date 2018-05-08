/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/administrator/organizations/index`, () => {
  describe('Index#BEFORE', () => {
    it('should bind memberships to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, administrator.organization.organizationid)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, administrator.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(null, req.data.memberships)
      assert.equal(req.data.memberships.length, 2)
    })

    it('should bind organizations to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const req = TestHelper.createRequest(`/administrator/organizations`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.organizations, null)
      assert.equal(req.data.organizations.length, 1)
    })
  })

  describe('Index#GET', () => {
    it('should have row for each organization', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      const req = TestHelper.createRequest(`/administrator/organizations`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const organizationRow = doc.getElementById(administrator.organization.organizationid)
        assert.notEqual(null, organizationRow)
      }
      return req.route.api.get(req, res)
    })

    it('should have row for each membership', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, administrator.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const membershipRow = doc.getElementById(user.membership.organizationid)
        assert.notEqual(null, membershipRow)
      }
      return req.route.api.get(req, res)
    })
  })
})
