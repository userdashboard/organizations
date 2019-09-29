/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/create-membership', () => {
  describe('exceptions', () => {
    describe('invalid-invitationid', () => {
      it('missing querystring invitationid', async () => {
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/create-membership')
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
        assert.strictEqual(errorMessage, 'invalid-invitationid')
      })

      it('invalid querystring invitationid', async () => {
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/create-membership?invitationid=invalid')
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
        assert.strictEqual(errorMessage, 'invalid-invitationid')
      })
    })

    describe('invalid-invitation', () => {
      it('querystring invitationid has been used', async () => {
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
        const user = await TestHelper.createUser()
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.acceptInvitation(user, owner)
        const user2 = await TestHelper.createUser()
        await TestHelper.createProfile(user2, {
          'display-name': user2.profile.firstName,
          'display-email': user2.profile.contactEmail
        })
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = user2.account
        req.session = user2.session
        req.body = {
          'secret-code': owner.invitation.secretCode,
          email: user2.profile.contactEmail,
          name: user2.profile.firstName
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-invitation')
      })

      it('posted secret-code has been used', async () => {
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
        const user = await TestHelper.createUser()
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.acceptInvitation(user, owner)
        const user2 = await TestHelper.createUser()
        await TestHelper.createProfile(user2, {
          'display-name': user2.profile.firstName,
          'display-email': user2.profile.contactEmail
        })
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = user2.account
        req.session = user2.session
        req.body = {
          'secret-code': owner.invitation.secretCode,
          email: user2.profile.contactEmail,
          name: user2.profile.firstName
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-invitation')
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
        await TestHelper.createInvitation(owner)
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': '',
          email: user.profile.displayEmail,
          name: user.profile.firstName
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-secret-code')
      })

      it('invalid posted secret-code', async () => {
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
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': 'invalid',
          email: user.profile.displayEmail,
          name: user.profile.firstName
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
      it('posted secret-code is blank', async () => {
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
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': '',
          email: user.profile.displayEmail,
          name: user.profile.firstName
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
    })

    describe('invalid-account', () => {
      it('accessing account is organization owner', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = owner.account
        req.session = owner.session
        req.body = {
          'secret-code': owner.invitation.secretCode,
          email: owner.profile.contactEmail,
          name: owner.profile.firstName
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-account')
      })

      it('accessing account is organization member', async () => {
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
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
        await TestHelper.createInvitation(owner)
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': owner.invitation.secretCode,
          profileid: user.profile.profileid
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

    describe('invalid-profileid', () => {
      it('missing posted profileid', async () => {
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
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': owner.invitation.secretCode,
          profileid: '',
          email: user.profile.displayEmail,
          name: user.profile.firstName
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-profileid')
      })

      it('invalid posted profileid', async () => {
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
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': owner.invitation.secretCode,
          profileid: 'invalid',
          email: user.profile.displayEmail,
          name: user.profile.firstName
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-profileid')
      })
    })

    describe('invalid-profile', () => {
      it('ineligible posted profileid is missing fields', async () => {
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
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': owner.invitation.secretCode,
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
        assert.strictEqual(errorMessage, 'invalid-profile')
      })
    })

    describe('invalid-invitation', () => {
      it('querystring invitationid is not open invitation', async () => {
        const owner = await TestHelper.createUser()
        const user = await TestHelper.createUser()
        const user2 = await TestHelper.createUser()
        global.userProfileFields = ['display-name', 'display-email']
        await TestHelper.createProfile(owner, {
          'display-name': owner.profile.firstName,
          'display-email': owner.profile.contactEmail
        })
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createProfile(user2, {
          'display-name': user2.profile.firstName,
          'display-email': user2.profile.contactEmail
        })
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user2, owner)
        const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          'secret-code': owner.invitation.secretCode,
          profileid: user.profile.profileid
        }
        let errorMessage
        try {
          await req.post()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-invitation')
      })
    })
  })

  describe('receives', () => {
    it('optionally-required posted first-name', async () => {
      global.requireProfile = true
      global.userProfileFields = ['full-name']
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?profileid=${user.account.profileid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'last-name': 'Person'
      }
      let errorMessage
      try {
        await req.patch()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-first-name')
    })

    it('optionally-required posted last-name', async () => {
      global.requireProfile = true
      global.userProfileFields = ['full-name']
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?profileid=${user.account.profileid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'first-name': 'Test'
      }
      let errorMessage
      try {
        await req.patch()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-last-name')
    })

    it('optionally-required posted display-name', async () => {
      global.requireProfile = true
      global.userProfileFields = ['display-name']
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?profileid=${user.account.profileid}`)
      req.account = user.account
      req.session = user.session
      req.body = {}
      let errorMessage
      try {
        await req.patch()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-display-name')
    })

    it('optionally-required posted company-name', async () => {
      global.requireProfile = true
      global.userProfileFields = ['company-name']
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?profileid=${user.account.profileid}`)
      req.account = user.account
      req.session = user.session
      req.body = {}
      let errorMessage
      try {
        await req.patch()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-company-name')
    })

    it('optionally-required posted contact-email', async () => {
      global.requireProfile = true
      global.userProfileFields = ['contact-email']
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?profileid=${user.account.profileid}`)
      req.account = user.account
      req.session = user.session
      req.body = {}
      let errorMessage
      try {
        await req.patch()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-contact-email')
    })

    it('optionally-required posted display-email', async () => {
      global.requireProfile = true
      global.userProfileFields = ['display-email']
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?profileid=${user.account.profileid}`)
      req.account = user.account
      req.session = user.session
      req.body = {}
      let errorMessage
      try {
        await req.patch()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-display-email')
    })

    it('optionally-required posted location', async () => {
      global.requireProfile = true
      global.userProfileFields = ['location']
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?profileid=${user.account.profileid}`)
      req.account = user.account
      req.session = user.session
      req.body = {}
      let errorMessage
      try {
        await req.patch()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-location')
    })

    it('optionally-required posted occupation', async () => {
      global.requireProfile = true
      global.userProfileFields = ['occupation']
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?profileid=${user.account.profileid}`)
      req.account = user.account
      req.session = user.session
      req.body = {}
      let errorMessage
      try {
        await req.patch()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-occupation')
    })

    it('optionally-required posted phone', async () => {
      global.requireProfile = true
      global.userProfileFields = ['phone']
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?profileid=${user.account.profileid}`)
      req.account = user.account
      req.session = user.session
      req.body = {}
      let errorMessage
      try {
        await req.patch()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-phone')
    })

    it('optionally-required posted dob', async () => {
      global.requireProfile = true
      global.userProfileFields = ['dob']
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?profileid=${user.account.profileid}`)
      req.account = user.account
      req.session = user.session
      req.body = {}
      let errorMessage
      try {
        await req.patch()
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-dob')
    })
  })

  describe('returns', () => {
    it('object', async () => {
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
      const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'secret-code': owner.invitation.secretCode,
        profileid: user.profile.profileid
      }
      const membership = await req.post()
      assert.strictEqual(membership.object, 'membership')
    })
  })
})
