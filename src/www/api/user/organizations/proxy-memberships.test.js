/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/user/organizations/proxy-memberships`, () => {
  describe('ProxyMemberships#GET', () => {
    it('should add membership list to header', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/proxy-memberships`, 'GET')
      req.account = user.account
      req.session = user.session
      await req.route.api.get(req)
      assert.notEqual(null, req.headers['x-memberships'])
      const memberships = JSON.parse(req.headers['x-memberships'])
      assert.equal(memberships.length, 1)
      assert.equal(memberships[0].membershipid, user.membership.membershipid)
    })

    it('should bundle organization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/proxy-memberships`, 'GET')
      req.account = user.account
      req.session = user.session
      await req.route.api.get(req)
      assert.notEqual(null, req.headers['x-memberships'])
      const memberships = JSON.parse(req.headers['x-memberships'])
      assert.equal(memberships.length, 1)
      assert.equal(memberships[0].organization.organizationid, owner.organization.organizationid)
    })

    it('should bundle invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code
      }
      await req.route.api.patch(req)
      await TestHelper.completeAuthorization(req)
      await req.route.api.patch(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/proxy-memberships`, 'GET')
      req2.account = user.account
      req2.session = user.session
      await req2.route.api.get(req2)
      assert.notEqual(null, req2.headers['x-memberships'])
      const memberships = JSON.parse(req2.headers['x-memberships'])
      assert.equal(memberships.length, 1)
      assert.equal(memberships[0].invitation.invitationid, owner.invitation.invitationid)
    })
  })
})
