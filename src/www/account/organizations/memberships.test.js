/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/account/organizations/memberships', () => {
  describe('Memberships#BEFORE', () => {
    it('should bind memberships to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest('/account/organizations/memberships')
      req.account = user.account
      req.session = user.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.memberships[0].membershipid, user.membership.membershipid)
    })
  })

  describe('Memberships#GET', () => {
    it('should limit memberships to one page', async () => {
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest('/account/organizations/memberships')
      req.account = user.account
      req.session = user.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('memberships-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest('/account/organizations/memberships')
      req.account = user.account
      req.session = user.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('memberships-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const user = await TestHelper.createUser()
      const memberships = []
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
        await TestHelper.createMembership(user, owner)
        memberships.unshift(user.membership)
      }
      const req = TestHelper.createRequest(`/account/organizations/memberships?offset=${offset}`)
      req.account = user.account
      req.session = user.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(doc.getElementById(memberships[offset + i].membershipid).tag, 'tr')
      }
    })
  })
})
