/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')
const DashboardTestHelper = require('@userdashboard/dashboard/test-helper.js')

describe('/account/organizations/organization-invitations', function () {
  const cachedResponses = {}
  const cachedInvitations = []
  before(async () => {
    await DashboardTestHelper.setupBeforeEach()
    await TestHelper.setupBeforeEach()
    global.delayDiskWrites = true
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
    for (let i = 0, len = global.pageSize + 1; i < len; i++) {
      await TestHelper.createInvitation(user)
      cachedInvitations.unshift(user.invitation.invitationid)
    }
    const req1 = TestHelper.createRequest(`/account/organizations/organization-invitations?organizationid=${user.organization.organizationid}`)
    req1.account = user.account
    req1.session = user.session
    req1.filename = __filename
    req1.screenshots = [
      { hover: '#account-menu-container' },
      { click: '/account/organizations' },
      { click: '/account/organizations/organizations' },
      { click: `/account/organizations/organization?organizationid=${user.organization.organizationid}` },
      { click: `/account/organizations/organization-invitations?organizationid=${user.organization.organizationid}` }
    ]
    await req1.route.api.before(req1)
    cachedResponses.before = req1.data
    cachedResponses.returns = await req1.get()
    global.pageSize = 3
    cachedResponses.pageSize = await req1.get()
    const req2 = TestHelper.createRequest(`/account/organizations/organization-invitations?organizationid=${user.organization.organizationid}&offset=1`)
    req2.account = user.account
    req2.session = user.session
    cachedResponses.offset = await req2.get()
  })
  describe('OrganizationInvitations#BEFORE', () => {
    it('should require owner', async () => {
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
      const req = TestHelper.createRequest(`/account/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`)
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should bind invitations to req', async () => {
      const data = cachedResponses.before
      assert.strictEqual(data.invitations.length, global.pageSize)
      assert.strictEqual(data.invitations[0].invitationid, cachedInvitations[0])
      assert.strictEqual(data.invitations[1].invitationid, cachedInvitations[1])
    })
  })

  describe('OrganizationInvitations#GET', () => {
    it('should limit invitations to one page (screenshots)', async () => {
      const result = cachedResponses.returns
      const doc = TestHelper.extractDoc(result.html)
      const table = doc.getElementById('invitations-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const result = cachedResponses.pageSize
      const doc = TestHelper.extractDoc(result.html)
      const table = doc.getElementById('invitations-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce specified offset', async () => {
      global.delayDiskWrites = true
      const offset = 1
      const result = cachedResponses.offset
      const doc = TestHelper.extractDoc(result.html)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(doc.getElementById(cachedInvitations[offset + i]).tag, 'tr')
      }
    })
  })
})
