/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/user/organizations/account-memberships`, () => {
  describe('AccountMemberships#GET', () => {
    it('should reject other account', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/account-memberships?accountid=${user.account.accountid}`, 'GET')
      req.account = user2.account
      req.session = user2.session
      let errorMessage
      try {
        await req.route.api.get(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-account')
    })

    it('should return membership list', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      await TestHelper.createMembership(user, owner2.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/account-memberships?accountid=${user.account.accountid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const memberships = await req.route.api.get(req)
      assert.equal(memberships.length, 2)
      assert.equal(memberships[0].organizationid, owner2.organization.organizationid)
      assert.equal(memberships[1].organizationid, owner.organization.organizationid)
    })
  })
})
