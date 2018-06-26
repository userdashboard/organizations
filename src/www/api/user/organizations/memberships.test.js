/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/memberships`, () => {
  describe('Memberships#GET', () => {
    it('should limit memberships to one page', async () => {
      const user = await TestHelper.createUser()
      const memberships = []
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createMembership(user, owner)
        memberships.unshift(user.membership)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const membershipsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(membershipsNow[i].membershipid, memberships[i].membershipid)
      }
    })

    it('should enforce page size', async () => {
      global.PAGE_SIZE = 3
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const codesNow = await req.route.api.get(req)
      assert.equal(codesNow.length, global.PAGE_SIZE)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const user = await TestHelper.createUser()
      const memberships = []
      for (let i = 0, len = global.PAGE_SIZE + offset + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        const membership = await TestHelper.createMembership(user, owner)
        memberships.unshift(membership)
      }
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
