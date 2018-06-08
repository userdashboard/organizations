/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/organizations-count', async () => {
  describe('OrganizationsCount#GET', () => {
    it('should count organizations', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createOrganization(owner)
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/organizations-count?accountid=${owner.account.accountid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const result = await req.route.api.get(req)
      assert.equal(result, 3)
    })
  })
})
