/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/membership-organizations', () => {
  describe('MembershipOrganizations#GET', () => {
    it('should return memberships\' organization list', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/membership-organizations?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const organizations = await req.route.api.get(req)
      assert.equal(organizations.length, 1)
      assert.equal(organizations[0].organizationid, owner.organization.organizationid)
    })

    it('should enforce page size', async () => {
      const user = await TestHelper.createUser()
      for (let i = 0, len = 20; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createMembership(user, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/membership-organizations?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      global.PAGE_SIZE = 8
      const codesNow = await req.route.api.get(req)
      assert.equal(codesNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const user = await TestHelper.createUser()
      const organizations = []
      for (let i = 0, len = 30; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createMembership(user, owner.organization.organizationid)
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/membership-organizations?accountid=${user.account.accountid}&offset=10`, 'GET')
      req.account = user.account
      req.session = user.session
      const memberOrganizations = await req.route.api.get(req)
      for (let i = 0, len = 10; i < len; i++) {
        assert.equal(memberOrganizations[i].organizationid, organizations[10 + i].organizationid)
      }
    })
  })
})
