/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/account/organizations/index`, () => {
  describe('Index#BEFORE', () => {
    it('should bind memberships to req', async () => {
      const owner = await TestHelper.createOwner()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/account/organizations`, 'GET')
      req.account = user.account
      req.session = user.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(null, req.data.memberships)
      assert.equal(req.data.memberships.length, 1)
    })

    it('should bind organizations to req', async () => {
      const owner = await TestHelper.createOwner()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/account/organizations`, 'GET')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.organizations, null)
      assert.equal(req.data.organizations.length, 1)
    })
  })

  describe('Index#GET', () => {
    it('should have row for each organization', async () => {
      const owner = await TestHelper.createOwner()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/account/organizations`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const organizationRow = doc.getElementById(owner.organization.organizationid)
        assert.notEqual(null, organizationRow)
      }
      return req.route.api.get(req, res)
    })

    it('should have row for each membership', async () => {
      const owner = await TestHelper.createOwner()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/account/organizations`, 'GET')
      req.account = owner.account
      req.session = owner.session
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
