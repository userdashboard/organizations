/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/memberships`, () => {
  describe('Memberships#GET', () => {
    it('should return membership list', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const memberships = await req.route.api.get(req)
      assert.equal(memberships.length, 1)
      assert.equal(memberships[0].membershipid, user.membership.membershipid)
    })

    it('should enforce page size', async () => {
      const user = await TestHelper.createUser()
      for (let i = 0, len = 10; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
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
      for (let i = 0, len = 10; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        const membership = await TestHelper.createMembership(user, owner)
        memberships.unshift(membership)
      }
      const offset = 3
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}&offset=${offset}`, 'GET')
      req.account = user.account
      req.session = user.session
      const membershipsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(membershipsNow[i].membershipid, memberships[offset + i].membershipid)
      }
    })
  })
})
