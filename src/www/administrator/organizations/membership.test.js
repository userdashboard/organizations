/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/administrator/organizations/membership`, () => {
  it('should require a membershipid', TestHelper.requireParameter(`/administrator/organizations/membership`, 'membershipid'))
  describe('Membership#BEFORE', () => {
    it('should bind membership to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, administrator.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.membership, null)
      assert.equal(req.data.membership.membershipid, user.membership.membershipid)
    })
  })

  describe('Membership#GET', () => {
    it('should have row for membership', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, administrator.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const membershipRow = doc.getElementById(user.membership.membershipid)
        assert.notEqual(null, membershipRow)
      }
      return req.route.api.get(req, res)
    })
  })
})
