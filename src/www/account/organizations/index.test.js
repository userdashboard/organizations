/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/account/organizations/index`, () => {
  describe('Index#BEFORE', () => {
    it('should bind memberships to req', async () => {
      const owner = await TestHelper.createOwner()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations`)
      req.account = user.account
      req.session = user.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.memberships.length, 1)
    })

    it('should bind organizations to req', async () => {
      const owner = await TestHelper.createOwner()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest(`/account/organizations`)
      req.account = owner.account
      req.session = owner.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.organizations.length, 1)
    })
  })

  describe('Index#GET', () => {
    it('should have row for each organization', async () => {
      const owner = await TestHelper.createOwner()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest(`/account/organizations`)
      req.account = owner.account
      req.session = owner.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const row = doc.getElementById(owner.organization.organizationid)
      assert.strictEqual(row.tag, 'tr')
    })

    it('should have row for each membership', async () => {
      const owner = await TestHelper.createOwner()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations`)
      req.account = owner.account
      req.session = owner.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const row = doc.getElementById(user.membership.organizationid)
      assert.strictEqual(row.tag, 'tr')
    })
  })
})
