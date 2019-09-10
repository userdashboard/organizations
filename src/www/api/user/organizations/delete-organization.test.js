/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/delete-organization', async () => {
  describe('exceptions', () => {
    describe('invalid-organizationid', () => {
      it('missing querystring organizationid', async () => {
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/delete-organization`)
        req.account = user.account
        req.session = user.session
        let errorMessage
        try {
          await req.delete()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })

      it('invalid querystring organizationid', async () => {
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/organizations/delete-organization?organizationid=invalid`)
        req.account = user.account
        req.session = user.session
        let errorMessage
        try {
          await req.delete()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })
    })

    describe('invalid-account', () => {
      it('accessing account does not own organization', async () => {
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
        global.userProfileFields = ['full-name', 'contact-email']
        const other = await TestHelper.createUser()
        global.userProfileFields = ['display-name', 'display-email']
        await TestHelper.createProfile(other, {
          'display-name': other.profile.firstName,
          'display-email': other.profile.contactEmail
        })
        await TestHelper.createOrganization(other, {
          email: other.profile.displayEmail,
          name: 'My organization',
          profileid: other.profile.profileid
        })
        const req = TestHelper.createRequest(`/api/user/organizations/delete-organization?organizationid=${other.organization.organizationid}`, 'DELETE')
        req.account = owner.account
        req.session = owner.session
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
      const req = TestHelper.createRequest(`/api/user/organizations/delete-organization?organizationid=${owner.organization.organizationid}`, 'DELETE')
      req.account = owner.account
      req.session = owner.session
      const deleted = await req.delete()
      assert.strictEqual(deleted, true)
    })
  })
})
