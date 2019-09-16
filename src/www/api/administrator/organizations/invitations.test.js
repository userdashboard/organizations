/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/invitations', () => {
  describe('receives', () => {
    it('optional querystring offset (integer)', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const invitations = []
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createOrganization(user, {
          email: user.profile.displayEmail,
          name: 'My organization',
          profileid: user.profile.profileid
        })
        await TestHelper.createInvitation(user, user.organization.organizationid)
        invitations.unshift(user.invitation)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitations?offset=${offset}`)
      req.account = administrator.account
      req.session = administrator.session
      const invitationsNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[offset + i].invitationid)
      }
    })

    it('optional querystring all (boolean)', async () => {
      const administrator = await TestHelper.createAdministrator()
      const invitations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createOrganization(user, {
          email: user.profile.displayEmail,
          name: 'My organization',
          profileid: user.profile.profileid
        })
        await TestHelper.createInvitation(user, user.organization.organizationid)
        invitations.unshift(user.invitation)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/invitations?all=true')
      req.account = administrator.account
      req.session = administrator.session
      const invitationsNow = await req.get()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[i].invitationid)
      }
    })
  })
  describe('returns', () => {
    it('array', async () => {
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
      const invitations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
        invitations.unshift(owner.invitation)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/invitations')
      req.account = administrator.account
      req.session = administrator.session
      const invitationsNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[i].invitationid)
      }
    })
  })

  describe('configuration', () => {
    it('environment PAGE_SIZE', async () => {
      global.pageSize = 3
      const administrator = await TestHelper.createAdministrator()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createOrganization(user, {
          email: user.profile.displayEmail,
          name: 'My organization',
          profileid: user.profile.profileid
        })
        await TestHelper.createInvitation(user, user.organization.organizationid)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/invitations')
      req.account = administrator.account
      req.session = administrator.session
      const invitationsNow = await req.get()
      assert.strictEqual(invitationsNow.length, global.pageSize)
    })
  })
})
