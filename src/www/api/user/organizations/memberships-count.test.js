/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/memberships-count', () => {
  describe('exceptions', () => {
    describe('invalid-accountid', () => {
      it('missing querystring accountid', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/memberships-count')
        req.account = owner.account
        req.session = owner.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-accountid')
      })

      it('invalid querystring accountid', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/memberships-count?accountid=invalid')
        req.account = owner.account
        req.session = owner.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-accountid')
      })
    })

    describe('invalid-account', () => {
      it('ineligible accessing account', async () => {
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
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
        const req = TestHelper.createRequest(`/api/user/organizations/memberships-count?accountid=${owner.account.accountid}`)
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
  })

  describe('returns', () => {
    it('integer', async () => {
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
      await await TestHelper.createInvitation(owner2)
      await TestHelper.acceptInvitation(user, owner2)
      global.userProfileFields = ['full-name', 'contact-email']
      const owner3 = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(owner3, {
        'display-name': owner3.profile.firstName,
        'display-email': owner3.profile.contactEmail
      })
      await TestHelper.createOrganization(owner3, {
        email: owner3.profile.displayEmail,
        name: 'My organization',
        profileid: owner3.profile.profileid
      })
      await await TestHelper.createInvitation(owner3)
      await TestHelper.acceptInvitation(user, owner3)
      const req = TestHelper.createRequest(`/api/user/organizations/memberships-count?accountid=${user.account.accountid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      assert.strictEqual(result, 3)
    })
  })
})
