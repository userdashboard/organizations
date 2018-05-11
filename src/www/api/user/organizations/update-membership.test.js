/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/update-membership', async () => {
  describe('UpdateMembership#PATCH', () => {
    it('should require own membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/update-membership?membershipid=${user.membership.membershipid}`, 'PATCH')
      req.account = user2.account
      req.session = user2.session
      req.body = {
        name: 'test',
        email: 'test@test.com'
      }
      try {
        await req.route.api.patch(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should reject invalid fields', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/update-membership?membershipid=${user.membership.membershipid}`, 'PATCH')
      req.account = user.account
      req.session = user.session
      req.body = {
        invalidField: 'field'
      }
      try {
        await req.route.api.patch(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-membership-field')
      }
    })

    it('should enforce field length', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/update-membership?membershipid=${user.membership.membershipid}`, 'PATCH')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: 'this-is-too-long-to-be-a-first-name-of-anyone',
        email: 'test@test.com'
      }
      global.MAXIMUM_MEMBERSHIP_FIELD_LENGTH = 10
      try {
        await req.route.api.patch(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-membership-field-length')
      }
    })

    it('should apply new values', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/update-membership?membershipid=${user.membership.membershipid}`, 'PATCH')
      req.account = user.account
      req.session = user.session
      req.body = {
        name: 'Person',
        email: 'test@test.com'
      }
      await req.route.api.patch(req)
      await TestHelper.completeAuthorization(req)
      await req.route.api.patch(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`, 'GET')
      req2.account = req.account
      req2.session = req.session
      const membershipNow = await req2.route.api.get(req2)
      assert.equal(membershipNow.name, 'Person')
      assert.equal(membershipNow.email, 'test@test.com')
    })
  })
})
