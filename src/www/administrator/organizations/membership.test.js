/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/administrator/organizations/membership`, () => {
  describe('Membership#BEFORE', () => {
    it('should bind membership to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/administrator/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.membership.membershipid, user.membership.membershipid)
    })
  })

  describe('Membership#GET', () => {
    it('should have row for membership', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/administrator/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = administrator.account
      req.session = administrator.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const tbody = doc.getElementById(user.membership.membershipid)
      assert.strictEqual(tbody.tag, 'tbody')
    })
  })
})
