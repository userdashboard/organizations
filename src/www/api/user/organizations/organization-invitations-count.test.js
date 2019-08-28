/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/organization-invitations-count', async () => {
  describe('OrganizationInvitationsCount#GET', () => {
    it('should count organization\'s invitations', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations-count?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      const result = await req.get(req)
      assert.strictEqual(result, 2)
    })
  })
})
