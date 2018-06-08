/* eslint-env mocha */
const assert = require('assert')
const XMembershipsHeader = require('./x-memberships-header.js')
const TestHelper = require('../test-helper.js')

describe(`proxy/x-memberships-header`, () => {
  describe('Memberships#GET', () => {
    it('should add membership list to header', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/proxy-memberships`, 'GET')
      req.account = user.account
      req.session = user.session
      await XMembershipsHeader.after(req)
      assert.notEqual(null, req.headers['x-memberships'])
      const memberships = JSON.parse(req.headers['x-memberships'])
      assert.equal(memberships.length, 1)
      assert.equal(memberships[0].membershipid, user.membership.membershipid)
    })
  })
})
