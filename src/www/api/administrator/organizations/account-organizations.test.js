/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/account-organizations', () => {
  describe('AccountOrganizations#GET', () => {
    it('should return account\'s organization list', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${owner.account.accountid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const organizations = await req.route.api.get(req)
      assert.equal(1, organizations.length)
      assert.equal(organizations[0].organizationid, owner.organization.organizationid)
    })

    it('should enforce page size', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      for (let i = 0, len = 10; i < len; i++) {
        await TestHelper.createOrganization(user)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      global.PAGE_SIZE = 8
      const organizationsNow = await req.route.api.get(req)
      assert.equal(organizationsNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const administrator = await TestHelper.createAdministrator()
      const organizations = [ ]
      const user = await TestHelper.createUser()
      for (let i = 0, len = 10; i < len; i++) {
        await TestHelper.createOrganization(user)
        organizations.unshift(user.organization)
      }
      const offset = 3
      const req = TestHelper.createRequest(`/api/administrator/organizations/account-organizations?accountid=${user.account.accountid}&offset=${offset}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const organizationsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(organizationsNow[i].codeid, organizations[offset + i].codeid)
      }
    })
  })
})
