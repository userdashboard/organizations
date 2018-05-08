/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/organization', () => {
  it('should require an organizationid', TestHelper.requireParameter('/api/administrator/organizations/organization', 'organizationid'))
  describe('Organization#GET', () => {
    it('should return organization data', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const organization = await req.route.api.get(req)
      assert.notEqual(organization, null)
      assert.notEqual(organization.organizationid, null)
    })

    it('should redact organization code', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const organization = await req.route.api.get(req)
      assert.notEqual(organization, null)
      assert.notEqual(organization.organizationid, null)
      assert.equal(organization.code, null)
    })
  })
})
