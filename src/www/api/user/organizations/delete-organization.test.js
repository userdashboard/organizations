/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/delete-organization', async () => {
  describe('DeleteOrganization#DELETE', () => {
    it('should require own organization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const other = await TestHelper.createUser()
      await TestHelper.createOrganization(other, { email: other.profile.contactEmail, name: 'My organization' })
      const req = TestHelper.createRequest(`/api/user/organizations/delete-organization?organizationid=${other.organization.organizationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      let errorMessage
      try {
        await req.route.api.delete(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should delete organization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const req = TestHelper.createRequest(`/api/user/organizations/delete-organization?organizationid=${owner.organization.organizationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      await req.delete(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/organization?organizationid=${owner.organization.organizationid}`)
      req2.account = owner.account
      req2.session = owner.session
      const organization = await req2.get(req2)
      assert.strictEqual(organization.message, 'invalid-organizationid')
    })
  })
})
