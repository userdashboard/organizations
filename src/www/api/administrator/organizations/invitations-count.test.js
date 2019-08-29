/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/invitations-count', async () => {
  describe('InvitationsCount#GET', () => {
    it('should count invitations', async () => {
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
      await TestHelper.createInvitation(owner)
      global.userProfileFields = [ 'full-name', 'contact-email' ]
      const owner2 = await TestHelper.createUser()
      global.userProfileFields = [ 'display-name', 'display-email' ]
      await TestHelper.createProfile(owner2, {
        'display-name': owner2.profile.firstName,
        'display-email': owner2.profile.contactEmail
      })
      await TestHelper.createOrganization(owner2, {
        email: owner2.profile.displayEmail,
        name: 'My organization',
        profileid: owner2.profile.profileid
      })
      await TestHelper.createInvitation(owner2)
      await TestHelper.createInvitation(owner2)
      const req = TestHelper.createRequest('/api/administrator/organizations/invitations-count')
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.get()
      assert.strictEqual(result, 3)
    })
  })
})
