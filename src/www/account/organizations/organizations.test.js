/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/account/organizations/organizations', () => {
  describe('Organizations#BEFORE', () => {
    it('should bind owned organizations to req', async () => {
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
      const req = TestHelper.createRequest('/account/organizations/organizations')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.organizations[0].organizationid, owner.organization.organizationid)
    })
  })

  describe('Organizations#GET', () => {
    it('should limit organizations to one page', async () => {
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
      const req = TestHelper.createRequest('/account/organizations/organizations')
      req.account = owner.account
      req.session = owner.session
      req.filename = __filename
      req.screenshots = [
        { hover: '#account-menu-container' },
        { click: '/account/organizations' },
        { click: `/account/organizations/organizations` }
      ]
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('organizations-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce page size', async () => {
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
      const req = TestHelper.createRequest('/account/organizations/organizations')
      req.account = owner.account
      req.session = owner.session
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('organizations-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce specified offset', async () => {
      global.delayDiskWrites = true
      const offset = 1
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
      const req = TestHelper.createRequest(`/account/organizations/organizations?offset=${offset}`)
      req.account = owner.account
      req.session = owner.session
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(doc.getElementById(organizations[offset + i]).tag, 'tr')
      }
    })
  })
})
