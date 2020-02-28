/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/organizations', () => {
  describe('exceptions', () => {
    describe('invalid-accountid', () => {
      it('missing querystring accountid', async () => {
        const owner = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/organizations/organizations')
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
        const req = TestHelper.createRequest('/api/user/organizations/organizations?accountid=invalid')
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
        const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}`)
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
      global.delayDiskWrites = true
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
        organizations.unshift(owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}&offset=${offset}`)
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(codesNow[i].organizationid, organizations[offset + i])
      }
    })

    it('optional querystring limit (integer)', async () => {
      const limit = 1
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      const organizations = []
      for (let i = 0, len = limit + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        organizations.unshift(owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}&limit=${limit}`)
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.get()
      assert.strictEqual(codesNow.length, limit)
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
        organizations.unshift(owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}&all=true`)
      req.account = owner.account
      req.session = owner.session
      const membershipsNow = await req.get()
      assert.strictEqual(membershipsNow.length, organizations.length)
    })
  })

  describe('returns', () => {
    it('array', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
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
      req.filename = __filename
      req.saveResponse = true
      const organizationsNow = await req.get()
      assert.strictEqual(organizationsNow.length, global.pageSize)
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
