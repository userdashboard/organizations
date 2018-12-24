/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/organization', () => {
  describe('Organization#GET', () => {
    it('should return organization data', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization?organizationid=${owner.organization.organizationid}`)
      req.account = administrator.account
      req.session = administrator.session
      const organization = await req.get(req)
      assert.strictEqual(organization.object, 'organization')
    })
  })
})
