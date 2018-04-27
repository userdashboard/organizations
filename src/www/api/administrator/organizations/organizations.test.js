/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/administrator/organizations/organizations', () => {
  it('should require an administrator', TestHelper.requireAdministrator('/api/administrator/organizations/organizations'))
  describe('Organizations#GET', () => {
    it('should return organization list', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      const req = TestHelper.createRequest('/api/administrator/organizations/organizations', 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const organizations = await req.route.api.get(req)
      assert.equal(true, organizations.length >= 3)
      assert.equal(organizations[0].organizationid, owner3.organization.organizationid)
      assert.equal(organizations[1].organizationid, owner2.organization.organizationid)
      assert.equal(organizations[2].organizationid, owner.organization.organizationid)
    })

    it('should filter by accountid', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      const req = TestHelper.createRequest(`/api/administrator/organizations/organizations?accountid=${owner.account.accountid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const organizations = await req.route.api.get(req)
      assert.equal(organizations.length, 1)
      assert.equal(organizations[0].organizationid, owner.organization.organizationid)
    })
  })
})
