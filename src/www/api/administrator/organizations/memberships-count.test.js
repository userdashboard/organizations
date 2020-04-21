/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/memberships-count', () => {
  describe('returns', () => {
    it('integer', async () => {
      const administrator = await TestHelper.createOwner()
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: owner.profile.displayEmail,
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      global.userProfileFields = ['full-name', 'contact-email']
      const user1 = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(user1, {
        'display-name': user1.profile.firstName,
        'display-email': user1.profile.contactEmail
      })
      await await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user1, owner)
      global.userProfileFields = ['full-name', 'contact-email']
      const owner2 = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(owner2, {
        'display-name': owner2.profile.firstName,
        'display-email': owner2.profile.contactEmail
      })
      await TestHelper.createOrganization(owner2, {
        email: owner2.profile.displayEmail,
        name: 'My organization',
        profileid: owner2.profile.profileid
      })
      global.userProfileFields = ['contact-email', 'full-name']
      const user2 = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(user2, {
        'display-name': user2.profile.firstName,
        'display-email': user2.profile.contactEmail
      })
      await await TestHelper.createInvitation(owner2)
      await TestHelper.acceptInvitation(user2, owner2)
      global.userProfileFields = ['contact-email', 'full-name']
      const user3 = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(user3, {
        'display-name': user3.profile.firstName,
        'display-email': user3.profile.contactEmail
      })
      await await TestHelper.createInvitation(owner2)
      await TestHelper.acceptInvitation(user3, owner2)
      const req = TestHelper.createRequest('/api/administrator/organizations/memberships-count')
      req.account = administrator.account
      req.session = administrator.session
      req.filename = __filename
      req.saveResponse = true
      const result = await req.get()
      assert.strictEqual(result, 5)
    })
  })
})
