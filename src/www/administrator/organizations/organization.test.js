/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/administrator/organizations/organization`, () => {
  it('should require an organizationid', TestHelper.requireParameter(`/administrator/organizations/organization`, 'organizationid'))
  describe('Organization#BEFORE', () => {
    it('should bind organization to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, administrator.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/organization?organizationid=${administrator.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.organization, null)
      assert.equal(req.data.organization.organizationid, administrator.organization.organizationid)
    })
  })

  describe('Organization#GET', () => {
    it('should have row for organization', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, administrator.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/organization?organizationid=${administrator.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const organizationRow = doc.getElementById(administrator.organization.organizationid)
        assert.notEqual(null, organizationRow)
      }
      return req.route.api.get(req, res)
    })
  })
})
