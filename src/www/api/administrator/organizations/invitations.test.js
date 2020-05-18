/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')
const DashboardTestHelper = require('@userdashboard/dashboard/test-helper.js')

describe('/api/administrator/organizations/invitations', function () {
  const cachedResponses = {}
  const cachedInvitations = []
  const accountInvitations = []
  const organizationInvitations = []
  before(async () => {
    await DashboardTestHelper.setupBeforeEach()
    await TestHelper.setupBeforeEach()
    const administrator = await TestHelper.createOwner()
    global.delayDiskWrites = true
    for (let i = 0, len = global.pageSize + 1; i < len; i++) {
      global.userProfileFields = ['contact-email', 'full-name']
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
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
      cachedInvitations.unshift(owner.invitation.invitationid)
    }
    global.userProfileFields = ['contact-email', 'full-name']
    const user = await TestHelper.createUser()
    global.userProfileFields = ['display-email', 'display-name']
    await TestHelper.createProfile(user, {
      'display-name': user.profile.firstName,
      'display-email': user.profile.contactEmail
    })
    await TestHelper.createOrganization(user, {
      email: user.profile.displayEmail,
      name: 'My organization 1',
      profileid: user.profile.profileid
    })
    for (let i = 0, len = 3; i < len; i++) {
      await TestHelper.createInvitation(user)
      organizationInvitations.unshift(user.invitation.invitationid)
      accountInvitations.unshift(user.invitation.invitationid)
      cachedInvitations.unshift(user.invitation.invitationid)
    }
    for (let i = 0, len = 3; i < len; i++) {
      global.userProfileFields = ['contact-email', 'full-name']
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
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
      await TestHelper.acceptInvitation(user, owner)
      accountInvitations.unshift(owner.invitation.invitationid)
      cachedInvitations.unshift(owner.invitation.invitationid)
    }
    const req1 = TestHelper.createRequest('/api/administrator/organizations/invitations?offset=1')
    req1.account = administrator.account
    req1.session = administrator.session
    cachedResponses.offset = await req1.get()
    const req2 = TestHelper.createRequest('/api/administrator/organizations/invitations?limit=1')
    req2.account = administrator.account
    req2.session = administrator.session
    cachedResponses.limit = await req2.get()
    const req3 = TestHelper.createRequest('/api/administrator/organizations/invitations?all=true')
    req3.account = administrator.account
    req3.session = administrator.session
    cachedResponses.all = await req3.get()
    const req4 = TestHelper.createRequest(`/api/administrator/organizations/invitations?accountid=${user.account.accountid}&all=true`)
    req4.account = administrator.account
    req4.session = administrator.session
    cachedResponses.accountid = await req4.get()
    const req5 = TestHelper.createRequest(`/api/administrator/organizations/invitations?organizationid=${user.organization.organizationid}&all=true`)
    req5.account = administrator.account
    req5.session = administrator.session
    cachedResponses.organizationid = await req5.get()
    const req6 = TestHelper.createRequest(`/api/administrator/organizations/invitations?accountid=${user.account.accountid}`)
    req6.account = administrator.account
    req6.session = administrator.session
    req6.filename = __filename
    req6.saveResponse = true
    cachedResponses.returns = await req6.get()
    global.pageSize = 3
    cachedResponses.pageSize = await req6.get()
  })
  describe('receives', () => {
    it('optional querystring offset (integer)', async () => {
      const offset = 1
      const invitationsNow = cachedResponses.offset
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(invitationsNow[i].invitationid, cachedInvitations[offset + i])
      }
    })

    it('optional querystring limit (integer)', async () => {
      const limit = 1
      const invitationsNow = cachedResponses.limit
      assert.strictEqual(invitationsNow.length, limit)
    })

    it('optional querystring all (boolean)', async () => {
      const invitationsNow = cachedResponses.all
      assert.strictEqual(invitationsNow.length, cachedInvitations.length)
    })

    it('optional querystring accountid (string)', async () => {
      const invitationsNow = cachedResponses.accountid
      assert.strictEqual(invitationsNow.length, accountInvitations.length)
    })

    it('optional querystring organizationid (string)', async () => {
      const invitationsNow = cachedResponses.organizationid
      assert.strictEqual(invitationsNow.length, organizationInvitations.length)
    })
  })
  describe('returns', () => {
    it('array', async () => {
      const invitationsNow = cachedResponses.returns
      assert.strictEqual(invitationsNow.length, global.pageSize)
    })
  })

  describe('configuration', () => {
    it('environment PAGE_SIZE', async () => {
      global.pageSize = 3
      const invitationsNow = cachedResponses.pageSize
      assert.strictEqual(invitationsNow.length, global.pageSize)
    })
  })
})
