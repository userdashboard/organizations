/* eslint-env mocha */
const assert = require('assert')
const BindMemberships = require('./bind-memberships.js')
const TestHelper = require('../../test-helper.js')

describe(`server/bind-memberships`, () => {
  describe('BindMemberships#GET', () => {
    it('should bind membership list to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/proxy-memberships`, 'GET')
      req.account = user.account
      req.session = user.session
      await BindMemberships.after(req)
      assert.notEqual(null, req.memberships)
      assert.equal(req.memberships.length, 1)
      assert.equal(req.memberships[0].membershipid, user.membership.membershipid)
    })
  })
})
