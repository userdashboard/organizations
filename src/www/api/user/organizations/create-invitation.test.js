/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/create-invitation', () => {
  describe('exceptions', () => {
    describe('invalid-organizationid', () => {
      it('missing querystring organizationid', async () => {
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/create-invitation')
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': 'a code',
          profileid: user.profile.profileid,
          email: user.profile.displayEmail,
          name: user.profile.firstName
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })

      it('invalid querystring organizationid', async () => {
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/create-invitation?organizationid=invalid')
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': 'a code',
          profileid: user.profile.profileid,
          email: user.profile.displayEmail,
          name: user.profile.firstName
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })
    })

    describe('invalid-secret-code', () => {
      it('missing posted secret-code', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`)
        req.account = owner.account
        req.session = owner.session
        req.body = {
          'secret-code': ''
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-secret-code')
      })
    })

    describe('invalid-secret-code-length', () => {
      it('posted secret-code too short', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`)
        req.account = owner.account
        req.session = owner.session
        req.body = {
          'secret-code': '1'
        }
        global.minimumInvitationCodeLength = 100
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-secret-code-length')
      })

      it('posted secret-code too long', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`)
        req.account = owner.account
        req.session = owner.session
        req.body = {
          'secret-code': '123456'
        }
        global.maximumInvitationCodeLength = 1
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-secret-code-length')
      })
    })

    describe('invalid-account', () => {
      it('accessing account is not organization owner', async () => {
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
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': 'a code'
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-account')
      })
    })
  })

  describe('receives', () => {
    it('required posted secret-code', async () => {
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
      const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        'secret-code': '1234567890'
      }
      const invitation = await req.post()
      assert.notStrictEqual(invitation.secretCodeHash, null)
      assert.notStrictEqual(invitation.secretCodeHash, undefined)
    })
  })

  describe('returns', () => {
    it('object', async () => {
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
      const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        'secret-code': 'this-is-the-code'
      }
      const invitation = await req.post()
      assert.strictEqual(invitation.object, 'invitation')
    })
  })
})
