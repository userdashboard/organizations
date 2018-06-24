/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/memberships', () => {
  describe('Memberships#GET', () => {
    it('should return membership list', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user1 = await TestHelper.createUser()
      await TestHelper.createMembership(user1, owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner2)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      const user3 = await TestHelper.createUser()
      await TestHelper.createMembership(user3, owner3)
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships', 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const memberships = await req.route.api.get(req)
      assert.equal(3, memberships.length)
      assert.equal(memberships[0].membershipid, user3.membership.membershipid)
      assert.equal(memberships[1].membershipid, user2.membership.membershipid)
      assert.equal(memberships[2].membershipid, user1.membership.membershipid)
    })

    it('should enforce page size', async () => {
      const administrator = await TestHelper.createAdministrator()
      for (let i = 0, len = 10; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships', 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      global.PAGE_SIZE = 8
      const membershipsNow = await req.route.api.get(req)
      assert.equal(membershipsNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const administrator = await TestHelper.createAdministrator()
      const memberships = [ ]
      for (let i = 0, len = 10; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner)
        memberships.unshift(user.membership)
      }
      const offset = 3
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships?offset=3', 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const membershipsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(membershipsNow[i].membershipid, memberships[offset + i].membershipid)
      }
    })
  })
})
