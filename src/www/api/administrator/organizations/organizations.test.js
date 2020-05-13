/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')
const DashboardTestHelper = require('@userdashboard/dashboard/test-helper.js')

describe('/api/administrator/organizations/organizations', function () {
  const cachedResponses = {}
  const cachedOrganizations = []
  const accountOrganizations = []
  before(async () => {
    await DashboardTestHelper.setupBeforeEach()
    await TestHelper.setupBeforeEach()
    const administrator = await TestHelper.createOwner()
    global.delayDiskWrites = true
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
      cachedOrganizations.unshift(user.organization.organizationid)
    }
    global.userProfileFields = ['contact-email', 'full-name']
    const user = await TestHelper.createUser()
    global.userProfileFields = ['display-email', 'display-name']
    await TestHelper.createProfile(user, {
      'display-name': user.profile.firstName,
      'display-email': user.profile.contactEmail
    })
    for (let i = 0, len = 3; i < len; i++) {
      await TestHelper.createOrganization(user, {
        email: user.profile.displayEmail,
        name: 'My organization 1',
        profileid: user.profile.profileid
      })
      accountOrganizations.unshift(user.organization.organizationid)
      cachedOrganizations.unshift(user.organization.organizationid)
    }
    const req1 = TestHelper.createRequest('/api/administrator/organizations/organizations?offset=1')
    req1.account = administrator.account
    req1.session = administrator.session
    cachedResponses.offset = await req1.get()
    const req2 = TestHelper.createRequest('/api/administrator/organizations/organizations?limit=1')
    req2.account = administrator.account
    req2.session = administrator.session
    cachedResponses.limit = await req2.get()
    const req3 = TestHelper.createRequest('/api/administrator/organizations/organizations?all=true')
    req3.account = administrator.account
    req3.session = administrator.session
    cachedResponses.all = await req3.get()
    const req4 = TestHelper.createRequest(`/api/administrator/organizations/organizations?accountid=${user.account.accountid}&all=true`)
    req4.account = administrator.account
    req4.session = administrator.session
    cachedResponses.accountid = await req4.get()
    const req5 = TestHelper.createRequest('/api/administrator/organizations/organizations')
    req5.account = administrator.account
    req5.session = administrator.session
    req5.filename = __filename
    req5.saveResponse = true
    cachedResponses.returns = await req5.get()
    global.pageSize = 3
    cachedResponses.pageSize = await req5.get()
  })
  describe('receives', () => {
    it('optional querystring offset (integer)', async () => {
      const offset = 1
      const organizationsNow = cachedResponses.offset
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(organizationsNow[i].organizationid, cachedOrganizations[offset + i])
      }
    })

    it('optional querystring limit (integer)', async () => {
      const limit = 1
      const organizationsNow = cachedResponses.limit
      assert.strictEqual(organizationsNow.length, limit)
    })

    it('optional querystring all (boolean)', async () => {
      const organizationsNow = cachedResponses.all
      assert.strictEqual(organizationsNow.length, cachedOrganizations.length)
    })

    it('optional querystring accountid (string)', async () => {
      const organizationsNow = cachedResponses.accountid
      assert.strictEqual(organizationsNow.length, accountOrganizations.length)
    })
  })

  describe('returns', () => {
    it('array', async () => {
      const administrator = await TestHelper.createOwner()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const owner = await TestHelper.createUser()
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
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
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/organizations')
      req.account = administrator.account
      req.session = administrator.session
      req.filename = __filename
      req.saveResponse = true
      const organizationsNow = await req.get()
      assert.strictEqual(organizationsNow.length, global.pageSize)
    })
  })

  describe('configuration', () => {
    it('environment PAGE_SIZE', async () => {
      global.pageSize = 3
      const administrator = await TestHelper.createOwner()
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
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/organizations')
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get()
      assert.strictEqual(organizationsNow.length, global.pageSize)
    })
  })
})
