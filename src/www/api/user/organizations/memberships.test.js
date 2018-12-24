/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/memberships`, () => {
  describe('Memberships#GET', () => {
    it('should limit memberships to one page', async () => {
      const user = await TestHelper.createUser()
      const memberships = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
        await TestHelper.createMembership(user, owner)
        memberships.unshift(user.membership)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}`)
      req.account = user.account
      req.session = user.session
      const membershipsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(membershipsNow[i].membershipid, memberships[i].membershipid)
      }
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}`)
      req.account = user.account
      req.session = user.session
      const codesNow = await req.get(req)
      assert.strictEqual(codesNow.length, global.pageSize)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const user = await TestHelper.createUser()
      const memberships = []
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
        const membership = await TestHelper.createMembership(user, owner)
        memberships.unshift(membership)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}&offset=${offset}`)
      req.account = user.account
      req.session = user.session
      const membershipsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(membershipsNow[i].membershipid, memberships[offset + i].membershipid)
      }
    })

    it('should return all records', async () => {
      const user = await TestHelper.createUser()
      const memberships = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
        const membership = await TestHelper.createMembership(user, owner)
        memberships.unshift(membership)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}&all=true`)
      req.account = user.account
      req.session = user.session
      const membershipsNow = await req.get(req)
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        assert.strictEqual(membershipsNow[i].membershipid, memberships[i].membershipid)
      }
    })
  })
})
