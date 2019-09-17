/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/invitation', () => {
  describe('exceptions', () => {
    describe('invalid-invitationid', async () => {
      it('missing querystring invitationid', async () => {
        const administrator = await TestHelper.createOwner()
        const req = TestHelper.createRequest('/api/administrator/organizations/invitation')
        req.account = administrator.account
        req.session = administrator.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-invitationid')
      })

      it('invalid querystring invitationid', async () => {
        const administrator = await TestHelper.createOwner()
        const req = TestHelper.createRequest('/api/administrator/organizations/invitation?invitationid=invalid')
        req.account = administrator.account
        req.session = administrator.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-invitationid')
      })
    })
  })

  describe('returns', () => {
    it('object', async () => {
      const administrator = await TestHelper.createAdministrator()
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
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = administrator.account
      req.session = administrator.session
      const invitation = await req.get()
      assert.strictEqual(invitation.object, 'invitation')
    })
  })

  describe('redacts', () => {
    it('secret code hash', async () => {
      const administrator = await TestHelper.createAdministrator()
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
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = administrator.account
      req.session = administrator.session
      const invitation = await req.get()
      assert.strictEqual(invitation.secretCode, undefined)
    })
  })
})
