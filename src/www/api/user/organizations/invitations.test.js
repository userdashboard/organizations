/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/invitations`, () => {
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
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        const invitation = await TestHelper.createInvitation(owner)
        invitations.unshift(invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}&offset=${offset}`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[offset + i].invitationid)
      }
    })

    it('optional querystring all (boolean)', async () => {
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
        const invitation = await TestHelper.createInvitation(owner)
        invitations.unshift(invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}&all=true`)
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
      const invitations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
        invitations.unshift(owner.invitation)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, invitations[i].invitationid)
      }
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
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.get()
      assert.strictEqual(invitationsNow.length, global.pageSize)
    })
  })
})
