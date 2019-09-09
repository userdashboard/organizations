/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/organization', () => {
  describe('Organization#GET', () => {
    it('should reject non-owner, non-member', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
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
      const req = TestHelper.createRequest(`/api/user/organizations/organization?organizationid=${owner.organization.organizationid}`)
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.get()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })
  })

  describe('returns', () => {
    it('object', async () => {
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
      const req = TestHelper.createRequest(`/api/user/organizations/organization?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      const organization = await req.get()
      assert.strictEqual(organization.object, 'organization')
    })
  })
})
