/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/organizations-count', async () => {
  describe('OrganizationsCount#GET', () => {
    it('should count organizations', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user, { email: user.profile.email, name: 'My organization' })
      await TestHelper.createOrganization(user, { email: user.profile.email, name: 'My organization' })
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2, { email: user2.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest('/api/administrator/organizations/organizations-count')
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.get(req)
      assert.strictEqual(result, 3)
    })
  })
})
