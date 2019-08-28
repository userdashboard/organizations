/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/membership', () => {
  describe('Membership#GET', () => {
    it('should return membership data', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner)
      const req = TestHelper.createRequest(`/api/administrator/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = administrator.account
      req.session = administrator.session
      const membership = await req.get(req)
      assert.strictEqual(membership.object, 'membership')
    })

    it('should redact membership code', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner)
      const req = TestHelper.createRequest(`/api/administrator/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = administrator.account
      req.session = administrator.session
      const membership = await req.get(req)
      assert.strictEqual(membership.code, undefined)
    })
  })
})
