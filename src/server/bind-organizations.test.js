/* eslint-env mocha */
const assert = require('assert')
const BindOrganizations = require('./bind-organizations.js')
const TestHelper = require('../../test-helper.js')

describe(`server/bind-organizations`, () => {
  describe('BindOrganizations#GET', () => {
    it('should bind organizations list to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/account/organizations`, 'GET')
      req.account = owner.account
      req.session = owner.session
      await BindOrganizations.after(req)
      assert.notEqual(null, req.organizations)
      assert.equal(req.organizations.length, 1)
      assert.equal(req.organizations[0].organizationid, owner.organization.organizationid)
    })
  })
})
