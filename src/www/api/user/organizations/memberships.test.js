/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')
const DashboardTestHelper = require('@userdashboard/dashboard/test-helper.js')

describe('/api/user/organizations/memberships', function () {
  const cachedResponses = {}
  const cachedMemberships = []
  const organizationMemberships = []
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
    await TestHelper.createOrganization(user, {
      email: user.profile.displayEmail,
      name: 'My organization',
      profileid: user.profile.profileid
    })
    cachedMemberships.unshift(user.membership.membershipid)
    organizationMemberships.unshift(user.membership.membershipid)
    for (let i = 0, len = 3; i < len; i++) {
      await TestHelper.createInvitation(user)
      const member = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(member, {
        'display-name': member.profile.firstName,
        'display-email': member.profile.contactEmail
      })
      await TestHelper.acceptInvitation(member, user)
      organizationMemberships.unshift(member.membership.membershipid)
    }
    const req1 = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}&offset=1`)
    req1.account = user.account
    req1.session = user.session
    cachedResponses.offset = await req1.get()
    const req2 = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}&limit=1`)
    req2.account = user.account
    req2.session = user.session
    cachedResponses.limit = await req2.get()
    const req3 = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}&all=true`)
    req3.account = user.account
    req3.session = user.session
    cachedResponses.all = await req3.get()
    const req4 = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}&organizationid=${user.organization.organizationid}&all=true`)
    req4.account = user.account
    req4.session = user.session
    cachedResponses.organizationid = await req4.get()
    const req5 = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${user.account.accountid}`)
    req5.account = user.account
    req5.session = user.session
    req5.filename = __filename
    req5.saveResponse = true
    cachedResponses.returns = await req5.get()
    global.pageSize = 3
    cachedResponses.pageSize = await req5.get()
  })

  describe('exceptions', () => {
    describe('invalid-accountid', () => {
      it('missing querystring accountid', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/memberships')
        req.account = owner.account
        req.session = owner.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-accountid')
      })

      it('invalid querystring accountid', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/memberships?accountid=invalid')
        req.account = owner.account
        req.session = owner.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-accountid')
      })
    })

    describe('invalid-account', () => {
      it('ineligible accessing account', async () => {
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
        const req = TestHelper.createRequest(`/api/user/organizations/memberships?accountid=${owner.account.accountid}`)
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
      const codesNow = cachedResponses.pageSize
      assert.strictEqual(codesNow.length, global.pageSize)
    })
  })
})
