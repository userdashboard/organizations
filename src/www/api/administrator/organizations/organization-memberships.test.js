/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/organization-memberships', () => {
  describe('exceptions', () => {
    describe('invalid-organizationid', () => {
      it('unspecified querystring organizationid', async () => {
        const administrator = await TestHelper.createOwner()
        const req = TestHelper.createRequest('/api/administrator/organizations/organization-memberships')
        req.account = administrator.account
        req.session = administrator.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })

      it('invalid querystring organizationid', async () => {
        const administrator = await TestHelper.createOwner()
        const req = TestHelper.createRequest('/api/administrator/organizations/organization-memberships?organizationid=invalid')
        req.account = administrator.account
        req.session = administrator.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-organizationid')
      })
    })
  })

  describe('receives', () => {
    it('optional querystring offset (integer)', async () => {
      const offset = 1
      global.delayDiskWrites = true
      const administrator = await TestHelper.createAdministrator()
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
      const memberships = [owner.membership]
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
        memberships.unshift(user.membership.membershipid)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}&offset=${offset}`)
      req.account = administrator.account
      req.session = administrator.session
      const membershipsNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(membershipsNow[i].membershipid, memberships[offset + i])
      }
    })

    it('optional querystring limit (integer)', async () => {
      const limit = 1
      const administrator = await TestHelper.createAdministrator()
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
      const memberships = [owner.membership]
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
        memberships.unshift(user.membership.membershipid)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}&limit=${limit}`)
      req.account = administrator.account
      req.session = administrator.session
      const membershipsNow = await req.get()
      assert.strictEqual(membershipsNow.length, limit)
    })

    it('optional querystring all (boolean)', async () => {
      const administrator = await TestHelper.createAdministrator()
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
      const memberships = [owner.membership]
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
        memberships.unshift(user.membership.membershipid)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}&all=true`)
      req.account = administrator.account
      req.session = administrator.session
      const membershipsNow = await req.get()
      assert.strictEqual(membershipsNow.length, memberships.length)
    })
  })

  describe('returns', () => {
    it('array', async () => {
      const administrator = await TestHelper.createAdministrator()
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
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['full-name', 'contact-email']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-name', 'display-email']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`)
      req.account = administrator.account
      req.session = administrator.session
      req.filename = __filename
      req.saveResponse = true
      const membershipsNow = await req.get()
      assert.strictEqual(membershipsNow.length, global.pageSize)
    })
  })

  describe('configuration', () => {
    it('environment PAGE_SIZE', async () => {
      global.pageSize = 3
      const administrator = await TestHelper.createAdministrator()
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
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organization-memberships?organizationid=${owner.organization.organizationid}`)
      req.account = administrator.account
      req.session = administrator.session
      const membershipsNow = await req.get()
      assert.strictEqual(membershipsNow.length, global.pageSize)
    })
  })
})
