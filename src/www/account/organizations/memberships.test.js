/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')
const DashboardTestHelper = require('@userdashboard/dashboard/test-helper.js')

describe('/account/organizations/memberships', function () {
  const cachedResponses = {}
  const cachedMemberships = []
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
      await TestHelper.acceptInvitation(user, owner)
      cachedMemberships.unshift(user.membership.membershipid)
    }
    const req1 = TestHelper.createRequest('/account/organizations/memberships')
    req1.account = user.account
    req1.session = user.session
    req1.filename = __filename
    req1.screenshots = [
      { hover: '#account-menu-container' },
      { click: '/account/organizations' },
      { click: '/account/organizations/memberships' }
    ]
    await req1.route.api.before(req1)
    cachedResponses.before = req1.data
    cachedResponses.returns = await req1.get()
    global.pageSize = 3
    cachedResponses.pageSize = await req1.get()
    const req2 = TestHelper.createRequest('/account/organizations/memberships?offset=1')
    req2.account = user.account
    req2.session = user.session
    cachedResponses.offset = await req2.get()
  })
  describe('before', () => {
    it('should bind data to req', async () => {
      const data = cachedResponses.before
      assert.strictEqual(data.memberships[0].membershipid, cachedMemberships[0])
    })
  })

  describe('view', () => {
    it('should use default page size (screenshots)', async () => {
      const result = cachedResponses.returns
      const doc = TestHelper.extractDoc(result.html)
      const table = doc.getElementById('memberships-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should change page size', async () => {
      global.pageSize = 3
      const result = cachedResponses.pageSize
      const doc = TestHelper.extractDoc(result.html)
      const table = doc.getElementById('memberships-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should change offset', async () => {
      const offset = 1
      const result = cachedResponses.offset
      const doc = TestHelper.extractDoc(result.html)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(doc.getElementById(cachedMemberships[offset + i]).tag, 'tr')
      }
    })

    it('should show profile fields if data exists', async () => {
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      const fields = {
        'full-name': 'First Last',
        'contact-email': 'contact@email.com',
        dob: '2000-01-01',
        phone: '456-789-0123',
        occupation: 'Programmer',
        location: 'USA',
        'company-name': user.profile.displayEmail.split('@')[1].split('.')[0],
        website: 'https://' + user.profile.displayEmail.split('@')[1]
      }
      const req = TestHelper.createRequest('/account/organizations/memberships')
      req.account = user.account
      req.session = user.session
      const usingFields = ['display-email', 'display-name']
      const postingBody = {
        'display-name': user.profile.displayName,
        'display-email': user.profile.displayEmail
      }
      for (const field in fields) {
        global.userProfileFields = ['contact-email', 'full-name']
        const owner = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(owner, {
          'display-name': owner.profile.firstName,
          'display-email': owner.profile.contactEmail
        })
        global.membershipProfileFields = ['display-email', 'display-name']
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        usingFields.push(field)
        if (field === 'full-name') {
          postingBody['first-name'] = fields[field].split(' ')[0]
          postingBody['last-name'] = fields[field].split(' ')[1]
        } else {
          postingBody[field] = fields[field]
        }
        global.userProfileFields = usingFields
        await TestHelper.createProfile(user, postingBody)
        await TestHelper.createInvitation(owner)
        global.membershipProfileFields = usingFields
        await TestHelper.acceptInvitation(user, owner)
        const result = await req.get()
        const doc = TestHelper.extractDoc(result.html)
        assert.strictEqual(doc.getElementById(`${field}-${user.membership.membershipid}`).tag, 'td')
      }
    })
  })
})
