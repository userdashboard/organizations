/* eslint-env mocha */
const assert = require('assert')
const XOrganizationsHeader = require('./x-organizations-header.js')
const TestHelper = require('../test-helper.js')

describe(`proxy/x-organizations-header`, () => {
  describe('ProxyOrganizations#GET', () => {
    it('should add organizations list to header', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/account/organizations`, 'GET')
      req.account = owner.account
      req.session = owner.session
      await XOrganizationsHeader.after(req)
      assert.notEqual(null, req.headers['x-organizations'])
      const organizations = JSON.parse(req.headers['x-organizations'])
      assert.equal(organizations.length, 1)
      assert.equal(organizations[0].organizationid, owner.organization.organizationid)
    })
  })
})
