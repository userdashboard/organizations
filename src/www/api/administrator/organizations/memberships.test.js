/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')
const DashboardTestHelper = require('@userdashboard/dashboard/test-helper.js')

describe('/api/administrator/organizations/memberships', function () {
  const cachedResponses = {}
  const cachedMemberships = []
  const accountMemberships = []
  const organizationMemberships = []
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
      cachedMemberships.unshift(owner.membership.membershipid)
      global.userProfileFields = ['contact-email', 'full-name']
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      cachedMemberships.unshift(user.membership.membershipid)
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
    accountMemberships.unshift(user.membership.membershipid)
    cachedMemberships.unshift(user.membership.membershipid)
    organizationMemberships.unshift(user.membership.membershipid)
    for (let i = 0, len = 3; i < len; i++) {
      global.userProfileFields = ['contact-email', 'full-name']
      const member = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(member, {
        'display-name': member.profile.firstName,
        'display-email': member.profile.contactEmail
      })
      await TestHelper.createInvitation(user)
      await TestHelper.acceptInvitation(member, user)
      organizationMemberships.unshift(member.membership.membershipid)
      cachedMemberships.unshift(user.membership.membershipid)
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
      cachedMemberships.unshift(owner.membership.membershipid)
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      accountMemberships.unshift(user.membership.membershipid)
      cachedMemberships.unshift(user.membership.membershipid)
    }
    const req1 = TestHelper.createRequest('/api/administrator/organizations/memberships?offset=1')
    req1.account = administrator.account
    req1.session = administrator.session
    cachedResponses.offset = await req1.get()
    const req2 = TestHelper.createRequest('/api/administrator/organizations/memberships?limit=1')
    req2.account = administrator.account
    req2.session = administrator.session
    cachedResponses.limit = await req2.get()
    const req3 = TestHelper.createRequest('/api/administrator/organizations/memberships?all=true')
    req3.account = administrator.account
    req3.session = administrator.session
    cachedResponses.all = await req3.get()
    const req4 = TestHelper.createRequest(`/api/administrator/organizations/memberships?accountid=${user.account.accountid}&all=true`)
    req4.account = administrator.account
    req4.session = administrator.session
    cachedResponses.accountid = await req4.get()
    const req5 = TestHelper.createRequest(`/api/administrator/organizations/memberships?organizationid=${user.organization.organizationid}&all=true`)
    req5.account = administrator.account
    req5.session = administrator.session
    cachedResponses.organizationid = await req5.get()
    const req6 = TestHelper.createRequest(`/api/administrator/organizations/memberships?accountid=${user.account.accountid}`)
    req6.account = administrator.account
    req6.session = administrator.session
    req6.saveResponse = true
    cachedResponses.returns = await req6.get()
    global.pageSize = 3
    cachedResponses.pageSize = await req6.get()
  })
  describe('receives', () => {
    it('optional querystring offset (integer)', async () => {
      const offset = 1
      const membershipsNow = cachedResponses.offset
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(membershipsNow[i].membershipid, cachedMemberships[offset + i])
      }
    })

    it('optional querystring limit (integer)', async () => {
      const limit = 1
      const membershipsNow = cachedResponses.limit
      assert.strictEqual(membershipsNow.length, limit)
    })

    it('optional querystring all (boolean)', async () => {
      const membershipsNow = cachedResponses.all
      assert.strictEqual(membershipsNow.length, cachedMemberships.length)
    })

    it('optional querystring accountid (string)', async () => {
      const membershipsNow = cachedResponses.accountid
      assert.strictEqual(membershipsNow.length, accountMemberships.length)
    })

    it('optional querystring organizationid (string)', async () => {
      const membershipsNow = cachedResponses.organizationid
      assert.strictEqual(membershipsNow.length, organizationMemberships.length)
    })
  })
  describe('returns', () => {
    it('array', async () => {
      const membershipsNow = cachedResponses.returns
      assert.strictEqual(membershipsNow.length, global.pageSize)
    })
  })

  describe('configuration', () => {
    it('environment PAGE_SIZE', async () => {
      global.pageSize = 3
      const membershipsNow = cachedResponses.pageSize
      assert.strictEqual(membershipsNow.length, global.pageSize)
    })
  })
})
