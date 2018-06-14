/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/account/organizations/owner/organizations', () => {
  describe('Organizations#BEFORE', () => {
    it('should bind owned organizations to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest('/account/organizations/owner/organizations', 'GET')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.organizations, null)
      assert.equal(req.data.organizations[0].organizationid, owner.organization.organizationid)
    })
  })

  describe('Organizations#GET', () => {
    it('should have row for each organization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest('/account/organizations/owner/organizations', 'GET')
      req.account = owner.account
      req.session = owner.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const membershipRow = doc.getElementById(owner.organization.organizationid)
        assert.notEqual(null, membershipRow)
      }
      return req.route.api.get(req, res)
    })

    it('should limit organizations to one page', async () => {
      const owner = await TestHelper.createUser()
      for (let i = 0, len = 10; i < len; i++) {
        await TestHelper.createOrganization(owner)
      }
      const req = TestHelper.createRequest('/account/organizations/owner/organizations', 'GET')
      req.account = owner.account
      req.session = owner.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const table = doc.getElementById('organizations-table')
        const rows = table.getElementsByTagName('tr')
        assert.equal(rows.length, global.PAGE_SIZE + 1)
      }
      return req.route.api.get(req, res)
    })

    it('should enforce page size', async () => {
      const owner = await TestHelper.createUser()
      for (let i = 0, len = 10; i < len; i++) {
        await TestHelper.createOrganization(owner)
      }
      const req = TestHelper.createRequest('/account/organizations/owner/organizations', 'GET')
      req.account = owner.account
      req.session = owner.session
      global.PAGE_SIZE = 8
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const table = doc.getElementById('organizations-table')
        const rows = table.getElementsByTagName('tr')
        assert.equal(rows.length, global.PAGE_SIZE + 1)
      }
      return req.route.api.get(req, res)
    })

    it('should enforce specified offset', async () => {
      const owner = await TestHelper.createUser()
      const organizations = []
      for (let i = 0, len = 10; i < len; i++) {
        await TestHelper.createOrganization(owner)
        organizations.unshift(owner.organization)
      }
      const offset = 3
      const req = TestHelper.createRequest('/account/organizations/owner/organizations?offset=3', 'GET')
      req.account = owner.account
      req.session = owner.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
          assert.notEqual(null, doc.getElementById(organizations[offset + i].organizationid))
        }
      }
      return req.route.api.get(req, res)
    })
  })
})
