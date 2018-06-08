/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/user/organizations/memberships`, () => {
  describe('Memberships#GET', () => {
    it('should return membership list', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const memberships = await req.route.api.get(req)
      assert.equal(memberships.length, 1)
      assert.equal(memberships[0].membershipid, user.membership.membershipid)
    })

    it('should enforce page size', async () => {
      const user = await TestHelper.createUser()
      for (let i = 0, len = 20; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createMembership(user, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      global.PAGE_SIZE = 8
      const codesNow = await req.route.api.get(req)
      assert.equal(codesNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const user = await TestHelper.createUser()
      const memberships = []
      for (let i = 0, len = 20; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        const membership = await TestHelper.createMembership(user, owner.organization.organizationid)
        memberships.unshift(membership)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}&offset=10`, 'GET')
      req.account = user.account
      req.session = user.session
      const membershipsNow = await req.route.api.get(req)
      for (let i = 0, len = 10; i < len; i++) {
        assert.equal(membershipsNow[i].membershipid, memberships[10 + i].membershipid)
      }
    })
  })
})
