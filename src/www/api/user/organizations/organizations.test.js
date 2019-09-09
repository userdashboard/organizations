/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/organizations', () => {
  describe('receives', () => {
    it('optional querystring offset (integer)', async () => {
      const offset = 1
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      const organizations = []
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}&offset=${offset}`)
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(codesNow[i].organizationid, organizations[offset + i].organizationid)
      }
    })

    it('optional querystring all (boolean)', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      const organizations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}&all=true`)
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.get()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        assert.strictEqual(codesNow[i].organizationid, organizations[i].organizationid)
      }
    })
  })

  describe('returns', () => {
    it('should reject other accountid', async () => {
      const user = await TestHelper.createUser()
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${user2.account.accountid}`)
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

    it('array', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = [ 'display-name', 'display-email' ]
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      const organizations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      const organizationsNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(organizationsNow[i].organizationid, organizations[i].organizationid)
      }
    })
  })

  describe('configuration', () => {
    it('environment PAGE_SIZE', async () => {
      global.pageSize = 3
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.get()
      assert.strictEqual(codesNow.length, global.pageSize)
    })
  })
})
