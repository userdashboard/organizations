/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/organization-invitations', () => {
  describe('exceptions', () => {
    describe('invalid-organizationid', () => {
      it('missing querystring organizationid', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/organization-invitations')
        req.account = owner.account
        req.session = owner.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })

      it('invalid querystring organizationid', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/organization-invitations?organizationid=invalid')
        req.account = owner.account
        req.session = owner.session
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
        const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`)
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

  describe('receives', () => {
    it('optional querystring offset (integer)', async () => {
      const offset = 1
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
      const invitations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
        invitations.unshift(owner.invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}&offset=${offset}`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[offset + i].invitationid)
      }
    })

    it('optional querystring offset (integer)', async () => {
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
      const invitations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
        invitations.unshift(owner.invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}&all=true`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[i].invitationid)
      }
    })
  })

  describe('returns', () => {
    it('array', async () => {
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
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      const invitations = await req.get()
      assert.strictEqual(invitations.length, global.pageSize)
    })
  })

  describe('configuration', () => {
    it('environment PAGE_SIZE', async () => {
      global.pageSize = 3
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
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      const invitations = await req.get()
      assert.strictEqual(invitations.length, global.pageSize)
    })
  })
})
