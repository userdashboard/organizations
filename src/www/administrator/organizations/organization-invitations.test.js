/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')
const DashboardTestHelper = require('@userdashboard/dashboard/test-helper.js')

describe('/administrator/organizations/organization-invitations', function () {
  const cachedResponses = {}
  const cachedInvitations = []
  before(async () => {
    await DashboardTestHelper.setupBeforeEach()
    await TestHelper.setupBeforeEach()
    global.delayDiskWrites = true
    const administrator = await TestHelper.createOwner()
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
    for (let i = 0, len = global.pageSize + 2; i < len; i++) {
      await TestHelper.createInvitation(user)
      cachedInvitations.unshift(user.invitation.invitationid)
    }
    const req1 = TestHelper.createRequest(`/administrator/organizations/organization-invitations?organizationid=${user.organization.organizationid}`)
    req1.account = administrator.account
    req1.session = administrator.session
    req1.filename = __filename
    req1.screenshots = [
      { hover: '#administrator-menu-container' },
      { click: '/administrator/organizations' },
      { click: '/administrator/organizations/organizations' },
      { click: `/administrator/organizations/organization?organizationid=${user.organization.organizationid}` },
      { click: `/administrator/organizations/organization-invitations?organizationid=${user.organization.organizationid}` }
    ]
    await req1.route.api.before(req1)
    cachedResponses.before = req1.data
    cachedResponses.returns = await req1.get()
    global.pageSize = 3
    cachedResponses.pageSize = await req1.get()
    const req2 = TestHelper.createRequest(`/administrator/organizations/organization-invitations?organizationid=${user.organization.organizationid}&offset=1`)
    req2.account = administrator.account
    req2.session = administrator.session
    cachedResponses.offset = await req2.get()
  })
  describe('before', () => {
    it('should bind data to req', async () => {
      const data = cachedResponses.before
      assert.strictEqual(data.invitations.length, global.pageSize)
      assert.strictEqual(data.invitations[0].invitationid, cachedInvitations[0])
      assert.strictEqual(data.invitations[1].invitationid, cachedInvitations[1])
    })
  })

  describe('view', () => {
    it('should return one page (screenshots)', async () => {
      const result = cachedResponses.returns
      const doc = TestHelper.extractDoc(result.html)
      const table = doc.getElementById('invitations-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should change page size', async () => {
      global.pageSize = 3
      const result = cachedResponses.pageSize
      const doc = TestHelper.extractDoc(result.html)
      const table = doc.getElementById('invitations-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should change offset', async () => {
      const offset = 1
      const result = cachedResponses.offset
      const doc = TestHelper.extractDoc(result.html)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(doc.getElementById(cachedInvitations[offset + i]).tag, 'tr')
      }
    })
  })
})
