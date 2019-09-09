/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/organization', () => {
describe('returns', () => {
  it('array', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      global.userProfileFields = [ 'display-name', 'display-email' ]
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: owner.profile.displayEmail,
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization?organizationid=${owner.organization.organizationid}`)
      req.account = administrator.account
      req.session = administrator.session
      const organization = await req.get()
      assert.strictEqual(organization.object, 'organization')
    })
  })
})
