/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/account-organizations', () => {
  describe('exceptions', () => {
    describe('invalid-accountid', async () => {
      it('missing querystring accountid', async () => {
        const administrator = await TestHelper.createOwner()
        const req = TestHelper.createRequest('/api/administrator/organizations/account-organizations')
        req.account = administrator.account
        req.session = administrator.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-accountid')
      })

      it('invalid querystring accountid', async () => {
        const administrator = await TestHelper.createOwner()
        const req = TestHelper.createRequest('/api/administrator/organizations/account-organizations?accountid=invalid')
        req.account = administrator.account
        req.session = administrator.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-accountid')
      })
    })
  })

  describe('receives', () => {
    it('optional querystring offset (integer)', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const organizations = []
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(user, {
          email: user.profile.displayEmail,
          name: 'My organization',
          profileid: user.profile.profileid
        })
        organizations.unshift(user.organization)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}&offset=${offset}`)
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(organizationsNow[i].organizationid, organizations[offset + i].organizationid)
      }
    })

    it('optional querystring all (boolean)', async () => {
      const administrator = await TestHelper.createAdministrator()
      const organizations = []
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(user, {
          email: user.profile.displayEmail,
          name: 'My organization',
          profileid: user.profile.profileid
        })
        organizations.unshift(user.organization)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}&all=true`)
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        assert.strictEqual(organizationsNow[i].organizationid, organizations[i].organizationid)
      }
    })
  })
  describe('returns', () => {
    it('array', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      const organizations = []
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
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}`)
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(organizationsNow[i].organizationid, organizations[i].organizationid)
      }
    })
  })

  describe('configuration', () => {
    it('environment PAGE_SIZE', async () => {
      global.pageSize = 3
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(user, {
          email: user.profile.displayEmail,
          name: 'My organization',
          profileid: user.profile.profileid
        })
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}`)
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get()
      assert.strictEqual(organizationsNow.length, global.pageSize)
    })
  })
})
