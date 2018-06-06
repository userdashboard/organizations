/* eslint-env mocha */
const assert = require('assert')
const Memberships = require('./bind-memberships.js')
const TestHelper = require('../test-helper.js')

describe(`server/bind-memberships`, () => {
  describe('BindMemberships#GET', () => {
    it('should bind membership list to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/proxy-memberships`, 'GET')
      req.account = user.account
      req.session = user.session
      await Memberships.after(req)
      assert.notEqual(null, req.memberships)
      assert.equal(req.memberships.length, 1)
      assert.equal(req.memberships[0].membershipid, user.membership.membershipid)
    })
  })
})