/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/account-organizations', () => {
  describe('AccountOrganizations#GET', () => {
    it('should limit account\'s organization list to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      const organizations = []
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createMembership(user, owner)
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const organizationsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(organizationsNow[i].organizationid, organizations[i].organizationid)
      }
    })

    it('should enforce page size', async () => {
      global.PAGE_SIZE = 3
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        await TestHelper.createOrganization(user)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const organizationsNow = await req.route.api.get(req)
      assert.equal(organizationsNow.length, global.PAGE_SIZE)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const organizations = [ ]
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.PAGE_SIZE + offset + 1; i < len; i++) {
        await TestHelper.createOrganization(user)
        organizations.unshift(user.organization)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}&offset=${offset}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const organizationsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(organizationsNow[i].organizationid, organizations[offset + i].organizationid)
      }
    })
  })
})
