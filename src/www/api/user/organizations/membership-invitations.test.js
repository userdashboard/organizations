/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/membership-invitations', () => {
  describe('MembershipInvitations#GET', () => {
    it('should return memberships\' invitation list', async () => {
      const user = await TestHelper.createUser()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      await TestHelper.acceptInvitation(user, owner)
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/membership-invitations?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const memberOrganizations = await req.route.api.get(req)
      assert.equal(memberOrganizations.length, 1)
      assert.equal(memberOrganizations[0].organizationid, owner.organization.organizationid)
    })

    it('should enforce page size', async () => {
      const user = await TestHelper.createUser()
      for (let i = 0, len = 10; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
        await TestHelper.acceptInvitation(user, owner)
        await TestHelper.createMembership(user, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/membership-invitations?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      global.PAGE_SIZE = 8
      const memberOrganizations = await req.route.api.get(req)
      assert.equal(memberOrganizations.length, 8)
    })

    it('should enforce specified offset', async () => {
      const user = await TestHelper.createUser()
      const organizations = []
      for (let i = 0, len = 10; i < len; i++) {
        const owner = await TestHelper.createUser()
        await TestHelper.createOrganization(owner)
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
        await TestHelper.acceptInvitation(user, owner)
        await TestHelper.createMembership(user, owner.organization.organizationid)
        organizations.unshift(owner.organization)
      }
      const offset = 3
      const req = TestHelper.createRequest(`/api/user/organizations/membership-invitations?accountid=${user.account.accountid}&offset=${offset}`, 'GET')
      req.account = user.account
      req.session = user.session
      const memberOrganizations = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(memberOrganizations[i].organizationid, organizations[offset + i].organizationid)
      }
    })
  })
})
