/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/membership', () => {
  describe('Membership#GET', () => {
    it('should return membership data', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner)
      const req = TestHelper.createRequest(`/api/administrator/organizations/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const membership = await req.route.api.get(req)
      assert.notEqual(membership, null)
      assert.notEqual(membership.membershipid, null)
    })

    it('should redact membership code', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner)
      const req = TestHelper.createRequest(`/api/administrator/organizations/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const membership = await req.route.api.get(req)
      assert.notEqual(membership, null)
      assert.notEqual(membership.membershipid, null)
      assert.equal(membership.code, null)
    })
  })
})
