/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/delete-organization', async () => {
  it('should require a user', TestHelper.requireAccount('/api/user/organizations/delete-organization'))
  it('should require an organizationid', TestHelper.requireParameter('/api/user/organizations/delete-organization', 'organizationid'))
  describe('DeleteOrganization#DELETE', () => {
    it('should require own organization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const other = await TestHelper.createUser()
      await TestHelper.createOrganization(other)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-organization?organizationid=${other.organization.organizationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      try {
        await req.route.api.delete(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should lock session for authorization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-organization?organizationid=${owner.organization.organizationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.delete(req)
      assert.equal(req.session.lockURL, `/api/user/organizations/delete-organization?organizationid=${owner.organization.organizationid}`)
    })

    it('should delete organization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/delete-organization?organizationid=${owner.organization.organizationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.delete(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/organization?organizationid=${owner.organization.organizationid}`, 'GET')
      req2.account = owner.account
      req2.session = owner.session
      try {
        await req2.route.api.get(req2)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })
  })
})
