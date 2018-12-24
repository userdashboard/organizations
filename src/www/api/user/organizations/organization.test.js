/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/organization', () => {
  describe('Organization#GET', () => {
    it('should reject non-owner, non-member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/organization?organizationid=${owner.organization.organizationid}`)
      req.account = user.account
      req.session = user.session
      const organization = await req.get(req)
      assert.strictEqual(organization.message, 'invalid-account')
    })

    it('should return organization data', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest(`/api/user/organizations/organization?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      const organization = await req.get(req)
      assert.strictEqual(organization.object, 'organization')
    })
  })
})
