/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/account-organizations', () => {
  describe('AccountOrganizations#GET', () => {
    it('should limit account\'s organization list to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      const organizations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
        await TestHelper.createMembership(user, owner)
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}`)
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(organizationsNow[i].organizationid, organizations[i].organizationid)
      }
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(user, { email: user.profile.contactEmail, name: 'My organization' })
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}`)
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get(req)
      assert.strictEqual(organizationsNow.length, global.pageSize)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const organizations = [ ]
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        await TestHelper.createOrganization(user, { email: user.profile.contactEmail, name: 'My organization' })
        organizations.unshift(user.organization)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}&offset=${offset}`)
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(organizationsNow[i].organizationid, organizations[offset + i].organizationid)
      }
    })
  })
})
