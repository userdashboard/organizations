/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

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

    it('should limit organization list to one page', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const organizations = []
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        await TestHelper.createOrganization(owner)
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const organizationsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(organizationsNow[i].organizationid, organizations[i].organizationid)
      }
    })

    it('should enforce page size', async () => {
      global.PAGE_SIZE = 3
      const owner = await TestHelper.createUser()
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        await TestHelper.createOrganization(owner)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.route.api.get(req)
      assert.equal(codesNow.length, global.PAGE_SIZE)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const owner = await TestHelper.createUser()
      const organizations = [ ]
      for (let i = 0, len = global.PAGE_SIZE + offset + 1; i < len; i++) {
        await TestHelper.createOrganization(owner)
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}&offset=${offset}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(codesNow[i].organizationid, organizations[offset + i].organizationid)
      }
    })
  })
})
