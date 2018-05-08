/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/account/organizations/owner/membership`, () => {
  it('should require a membershipid', TestHelper.requireParameter(`/account/organizations/owner/membership`, 'membershipid'))
  describe('Membership#BEFORE', () => {
    it('should require owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/account/organizations/owner/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = user.account
      req.session = user.session
      try {
        await req.route.api.before(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-account')
      }
    })

    it('should bind membership to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/account/organizations/owner/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.membership, null)
      assert.equal(req.data.membership.membershipid, user.membership.membershipid)
    })
  })

  describe('Membership#GET', () => {
    it('should have row for membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/account/organizations/owner/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
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
