/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/organizations', () => {
  describe('Organizations#GET', () => {
    it('should reject other accountid', async () => {
      const user = await TestHelper.createUser()
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${user2.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.route.api.get(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-account')
    })

    it('should return organization list', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const organizations = await req.route.api.get(req)
      assert.equal(organizations.length, 1)
      assert.equal(organizations[0].organizationid, owner.organization.organizationid)
    })

    it('should enforce page size', async () => {
      const owner = await TestHelper.createUser()
      for (let i = 0, len = 20; i < len; i++) {
        await TestHelper.createOrganization(owner)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      global.PAGE_SIZE = 8
      const codesNow = await req.route.api.get(req)
      assert.equal(codesNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const owner = await TestHelper.createUser()
      const organizations = [ ]
      for (let i = 0, len = 30; i < len; i++) {
        await TestHelper.createOrganization(owner)
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}&offset=10`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.route.api.get(req)
      for (let i = 0, len = 10; i < len; i++) {
        assert.equal(codesNow[i].organizationid, organizations[10 + i].organizationid)
      }
    })
  })
})
