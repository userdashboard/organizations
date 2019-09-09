/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/account-organizations-count', async () => {
  describe('returns', () => {
    it('integer', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      const user2 = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      await TestHelper.createProfile(user2, {
        'display-name': user2.profile.firstName,
        'display-email': user2.profile.contactEmail
      })
      await TestHelper.createOrganization(user, {
        email: user.profile.displayEmail,
        name: 'My organization',
        profileid: user.profile.profileid
      })
      await TestHelper.createOrganization(user, {
        email: user.profile.displayEmail,
        name: 'My other organization',
        profileid: user.profile.profileid
      })
      await TestHelper.createOrganization(user2, {
        email: user2.profile.displayEmail,
        name: 'My organization',
        profileid: user2.profile.profileid
      })
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations-count?accountid=${user.account.accountid}`)
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.get()
      assert.strictEqual(result, 2)
    })
  })
})
