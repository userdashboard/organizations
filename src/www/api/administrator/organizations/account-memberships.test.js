/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/account-memberships', () => {
  describe('AccountMemberships#GET', () => {
    it('should limit account\'s membership list to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createMembership(user, owner)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-memberships?accountid=${user.account.accountid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const memberships = await req.route.api.get(req)
      assert.equal(memberships.length, global.PAGE_SIZE)
    })

    it('should enforce page size', async () => {
      global.PAGE_SIZE = 3
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createMembership(user, owner)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-memberships?accountid=${user.account.accountid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const membershipsNow = await req.route.api.get(req)
      assert.equal(membershipsNow.length, global.PAGE_SIZE)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      const memberships = []
      for (let i = 0, len = global.PAGE_SIZE + offset + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createMembership(user, owner)
        memberships.unshift(user.membership)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-memberships?accountid=${user.account.accountid}&offset=${offset}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const membershipsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(membershipsNow[i].membershipid, memberships[offset + i].membershipid)
      }
    })
  })
})
