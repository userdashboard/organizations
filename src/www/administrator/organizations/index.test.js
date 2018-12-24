/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/administrator/organizations/index`, () => {
  describe('Index#BEFORE', () => {
    it('should bind memberships to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner)
      const req = TestHelper.createRequest(`/administrator/organizations`)
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.memberships.length, global.pageSize)
    })

    it('should bind organizations to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user, { email: user.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest(`/administrator/organizations`)
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.organizations.length, 1)
    })
  })

  describe('Index#GET', () => {
    it('should have row for each organization', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest(`/administrator/organizations`)
      req.account = administrator.account
      req.session = administrator.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const row = doc.getElementById(owner.organization.organizationid)
      assert.strictEqual(row.tag, 'tr')
    })

    it('should have organization row for each membership', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/administrator/organizations`)
      req.account = administrator.account
      req.session = administrator.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const row = doc.getElementById(user.membership.organizationid)
      assert.strictEqual(row.tag, 'tr')
    })
  })
})
