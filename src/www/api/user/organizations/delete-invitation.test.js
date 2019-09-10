/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/delete-invitation', async () => {
  describe('exceptions', () => {
    describe('invalid-invitationid', () => {
      it('querystring invitationid is missing', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation`)
        req.account = owner.account
        req.session = owner.session
        let errorMessage
        try {
          await req.delete()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-invitationid')
      })

      it('querystring invitationid is invalid', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=invalid`)
        req.account = owner.account
        req.session = owner.session
        let errorMessage
        try {
          await req.delete()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-invitationid')
      })
    })

    describe('invalid-invitation', () => {
      it('querystring invitationid is used invitation', async () => {
        const owner = await TestHelper.createUser()
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
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
        const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
        req.account = owner.account
        req.session = owner.session
        let errorMessage
        try {
          await req.delete()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-invitation')
      })
    })
  
    describe('invalid-account', () => {
      it('accessing account is not organization owner', async () => {
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
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
        req.account = user.account
        req.session = user.session
        let errorMessage
        try {
          await req.delete()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-account')
      })
    })
  })

  describe('returns', () => {
    it('boolean', async () => {
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
      const req = TestHelper.createRequest(`/api/user/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      const deleted = await req.delete()
      assert.strictEqual(deleted, true)
    })
  })
})
