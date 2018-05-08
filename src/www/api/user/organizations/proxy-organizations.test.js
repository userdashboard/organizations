/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/user/organizations/proxy-organizations`, () => {
  describe('ProxyOrganizations#GET', () => {
    it('should add organizations list to header', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/proxy-organizations`, 'GET')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.get(req)
      assert.notEqual(null, req.headers['x-organizations'])
      const organizations = JSON.parse(req.headers['x-organizations'])
      assert.equal(organizations.length, 1)
      assert.equal(organizations[0].organizationid, owner.organization.organizationid)
    })
  })
})
