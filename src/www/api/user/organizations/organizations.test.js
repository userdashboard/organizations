/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/organizations', () => {
  describe('Organizations#GET', () => {
    it('should reject other accountid', async () => {
      const user = await TestHelper.createUser()
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${user2.account.accountid}`)
      req.account = user.account
      req.session = user.session
      const organizations = await req.get(req)
      assert.strictEqual(organizations.message, 'invalid-account')
    })

    it('should limit organization list to one page', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const organizations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      const organizationsNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(organizationsNow[i].organizationid, organizations[i].organizationid)
      }
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const owner = await TestHelper.createUser()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}`)
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.get(req)
      assert.strictEqual(codesNow.length, global.pageSize)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const owner = await TestHelper.createUser()
      const organizations = [ ]
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}&offset=${offset}`)
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.get(req)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(codesNow[i].organizationid, organizations[offset + i].organizationid)
      }
    })

    it('should return all records', async () => {
      const owner = await TestHelper.createUser()
      const organizations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/organizations?accountid=${owner.account.accountid}&all=true`)
      req.account = owner.account
      req.session = owner.session
      const codesNow = await req.get(req)
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        assert.strictEqual(codesNow[i].organizationid, organizations[i].organizationid)
      }
    })
  })
})
