/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/organization-invitations-count', async () => {
  describe('OrganizationInvitationsCount#GET', () => {
    it('should count organization\'s invitations', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2, { email: owner2.profile.contactEmail, name: 'My organization' })
      await TestHelper.createInvitation(owner2)
      await TestHelper.createInvitation(owner2)
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-invitations-count?organizationid=${owner2.organization.organizationid}`)
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.get(req)
      assert.strictEqual(result, 2)
    })
  })
})
