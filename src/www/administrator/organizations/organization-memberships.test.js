/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/administrator/organizations/organization-memberships`, () => {
  describe('OrganizationMemberships#BEFORE', () => {
    it('should bind memberships to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user1 = await TestHelper.createUser()
      await TestHelper.createMembership(user1, owner)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner)
      const req = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`)
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.memberships.length, global.pageSize)
      assert.strictEqual(req.data.memberships[0].membershipid, user2.membership.membershipid)
      assert.strictEqual(req.data.memberships[1].membershipid, user1.membership.membershipid)
    })
  })

  describe('OrganizationMemberships#GET', () => {
    it('should limit memberships to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`)
      req.account = administrator.account
      req.session = administrator.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('memberships-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`)
      req.account = administrator.account
      req.session = administrator.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('memberships-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const memberships = []
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createMembership(user, owner)
        memberships.unshift(user.membership)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}&offset=${offset}`)
      req.account = administrator.account
      req.session = administrator.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(doc.getElementById(memberships[offset + i].membershipid).tag, 'tr')
      }
    })
  })
})
