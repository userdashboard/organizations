/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')
const DashboardTestHelper = require('@userdashboard/dashboard/test-helper.js')

describe('/administrator/organizations/organization-memberships', function () {
  const cachedResponses = {}
  const cachedMemberships = []
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
    cachedMemberships.unshift(user.membership.membershipid)
    for (let i = 0, len = global.pageSize + 2; i < len; i++) {
      const member = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(member, {
        'display-name': member.profile.firstName,
        'display-email': member.profile.contactEmail
      })
      await TestHelper.createInvitation(user)
      await TestHelper.acceptInvitation(member, user)
      cachedMemberships.unshift(member.membership.membershipid)
    }
    const req1 = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${user.organization.organizationid}`)
    req1.account = administrator.account
    req1.session = administrator.session
    req1.filename = __filename
    req1.screenshots = [
      { hover: '#administrator-menu-container' },
      { click: '/administrator/organizations' },
      { click: '/administrator/organizations/organizations' },
      { click: `/administrator/organizations/organization?organizationid=${user.organization.organizationid}` },
      { click: `/administrator/organizations/organization-memberships?organizationid=${user.organization.organizationid}` }
    ]
    await req1.route.api.before(req1)
    cachedResponses.before = req1.data
    cachedResponses.returns = await req1.get()
    global.pageSize = 3
    cachedResponses.pageSize = await req1.get()
    const req2 = TestHelper.createRequest(`/administrator/organizations/organization-memberships?organizationid=${user.organization.organizationid}&offset=1`)
    req2.account = administrator.account
    req2.session = administrator.session
    cachedResponses.offset = await req2.get()
  })
  describe('OrganizationMemberships#BEFORE', () => {
    it('should bind memberships to req', async () => {
      const data = cachedResponses.before
      assert.strictEqual(data.memberships.length, global.pageSize)
      assert.strictEqual(data.memberships[0].membershipid, cachedMemberships[0])
      assert.strictEqual(data.memberships[1].membershipid, cachedMemberships[1])
    })
  })

  describe('OrganizationMemberships#GET', () => {
    it('should limit memberships to one page (screenshots)', async () => {
      const result = cachedResponses.returns
      const doc = TestHelper.extractDoc(result.html)
      const table = doc.getElementById('memberships-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const result = cachedResponses.pageSize
      const doc = TestHelper.extractDoc(result.html)
      const table = doc.getElementById('memberships-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const result = cachedResponses.offset
      const doc = TestHelper.extractDoc(result.html)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(doc.getElementById(cachedMemberships[offset + i]).tag, 'tr')
      }
    })
  })
})
