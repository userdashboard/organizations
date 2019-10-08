/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/update-organization', () => {
  describe('exceptions', () => {
    describe('invalid-organizationid', () => {
      it('missing querystring organizationid', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/update-organization')
        req.account = owner.account
        req.session = owner.session
        let errorMessage
        try {
          await req.patch()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })

      it('invalid querystring organizationid', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/update-organization?organizationid=invalid')
        req.account = owner.account
        req.session = owner.session
        let errorMessage
        try {
          await req.patch()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })
    })

    describe('invalid-account', () => {
      it('accessing account is not organization owner', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`)
        req.account = user.account
        req.session = user.session
        let errorMessage
        try {
          await req.patch()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-account')
      })
    })

    describe('invalid-organization-name', () => {
      it('missing posted name', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`)
        req.account = owner.account
        req.session = owner.session
        req.body = {
          name: '',
          email: owner.profile.contactEmail
        }
        let errorMessage
        try {
          await req.patch(req)
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organization-name')
      })
    })

    describe('invalid-organization-name-length', () => {
      it('posted name is too short', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`)
        req.account = owner.account
        req.session = owner.session
        req.body = {
          name: '12345',
          email: owner.profile.contactEmail
        }
        global.minimumOrganizationNameLength = 100
        let errorMessage
        try {
          await req.patch(req)
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organization-name-length')
        global.maximumOrganizationNameLength = 1
        errorMessage = undefined
        try {
          await req.patch(req)
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organization-name-length')
      })

      it('posted name is too long', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`)
        req.account = owner.account
        req.session = owner.session
        req.body = {
          name: '12345',
          email: owner.profile.contactEmail
        }
        global.maximumOrganizationNameLength = 1
        let errorMessage
        try {
          await req.patch(req)
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organization-name-length')
        global.maximumOrganizationNameLength = 1
        errorMessage = undefined
        try {
          await req.patch(req)
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organization-name-length')
      })
    })

    describe('invalid-organization-email', () => {
      it('missing posted email', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`)
        req.account = owner.account
        req.session = owner.session
        req.body = {
          name: 'New name',
          email: ''
        }
        let errorMessage
        try {
          await req.patch(req)
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organization-email')
      })

      it('invalid posted email', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`)
        req.account = owner.account
        req.session = owner.session
        req.body = {
          name: 'New name',
          email: 'invalid'
        }
        let errorMessage
        try {
          await req.patch(req)
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organization-email')
      })
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
      const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: 'Organization Name',
        email: 'test@test.com'
      }
      const organizationNow = await req.patch()
      assert.strictEqual(organizationNow.name, 'Organization Name')
      assert.strictEqual(organizationNow.email, 'test@test.com')
    })
  })
})
