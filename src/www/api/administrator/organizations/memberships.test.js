/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/memberships', () => {
  describe('Memberships#GET', () => {
    it('should limit membership list to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const memberships = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner)
        memberships.push(user.membership)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships')
      req.account = administrator.account
      req.session = administrator.session
      const membershipsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(membershipsNow[i].codeid, memberships[i].codeid)
      }
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const administrator = await TestHelper.createAdministrator()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships')
      req.account = administrator.account
      req.session = administrator.session
      const membershipsNow = await req.get(req)
      assert.strictEqual(membershipsNow.length, global.pageSize)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const memberships = [ ]
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
        memberships.unshift(owner.membership)
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner)
        memberships.unshift(user.membership)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/memberships?offset=${offset}`)
      req.account = administrator.account
      req.session = administrator.session
      const membershipsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(membershipsNow[i].membershipid, memberships[offset + i].membershipid)
      }
    })

    it('should return all records', async () => {
      const administrator = await TestHelper.createAdministrator()
      const memberships = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
        memberships.unshift(owner.membership)
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner)
        memberships.unshift(user.membership)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/memberships?all=true`)
      req.account = administrator.account
      req.session = administrator.session
      const membershipsNow = await req.get(req)
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        assert.strictEqual(membershipsNow[i].membershipid, memberships[i].membershipid)
      }
    })
  })
})
