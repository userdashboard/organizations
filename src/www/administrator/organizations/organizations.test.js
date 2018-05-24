/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe('/administrator/organizations/organizations', () => {
  describe('Organizations#BEFORE', () => {
    it('should bind owned organizations to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest('/administrator/organizations/organizations', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.organizations, null)
      assert.equal(req.data.organizations[0].organizationid, owner.organization.organizationid)
    })

    it('should not bind member organizations to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest('/administrator/organizations/organizations', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.organizations, null)
      assert.equal(req.data.organizations.length, 1)
    })
  })

  describe('Organizations#GET', () => {
    it('should have row for each membership', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest('/administrator/organizations/organizations', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const membershipRow = doc.getElementById(owner.organization.organizationid)
        assert.notEqual(null, membershipRow)
      }
      return req.route.api.get(req, res)
    })
  })
})
