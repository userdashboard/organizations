/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/account-organizations-count', async () => {
  describe('AccountOrganizationsCount#GET', () => {
    it('should count account\'s organizations', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await TestHelper.createOrganization(user)
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2)
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations-count?accountid=${user.account.accountid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.route.api.get(req)
      assert.equal(result, 2)
    })
  })
})
