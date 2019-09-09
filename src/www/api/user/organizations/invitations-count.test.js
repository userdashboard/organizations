/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/invitations-count', async () => {
  describe('returns', () => {
    it('integer', async () => {
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
      await TestHelper.createInvitation(owner)
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/invitations-count?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      const result = await req.get()
      assert.strictEqual(result, 3)
    })
  })
})
