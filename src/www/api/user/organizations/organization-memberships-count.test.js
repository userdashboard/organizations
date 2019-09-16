/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/organization-memberships-count', async () => {
  describe('exceptions', () => {
    describe('invalid-organizationid', () => {
      it('missing querystring organizationid', async () => {
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/organization-memberships')
        req.account = user.account
        req.session = user.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })

      it('invalid querystring organizationid', async () => {
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/organization-memberships?organizationid=invalid')
        req.account = user.account
        req.session = user.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })
    })

    describe('invalid-account', () => {
      it('accessing account must be organization member', async () => {
        const owner = await TestHelper.createUser()
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-name', 'display-email']
        await TestHelper.createProfile(owner, {
          'display-name': owner.profile.firstName,
          'display-email': owner.profile.contactEmail
        })
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
        const user2 = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`)
        req.account = user2.account
        req.session = user2.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-account')
      })
    })
  })

  describe('returns', () => {
    it('integer', async () => {
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
      global.userProfileFields = ['contact-email', 'full-name']
      const user2 = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(user2, {
        'display-name': user2.profile.firstName,
        'display-email': user2.profile.contactEmail
      })
      await await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user2, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/organization-memberships-count?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      const result = await req.get()
      assert.strictEqual(result, 3)
    })
  })
})
