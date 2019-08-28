/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/update-membership', async () => {
  describe('UpdateMembership#PATCH', () => {
    it('should require own membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/update-membership?membershipid=${user.membership.membershipid}`)
      req.account = user2.account
      req.session = user2.session
      req.body = {
        name: 'test',
        email: 'test@test.com'
      }
      let errorMessage
      try {
        await req.route.api.patch(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should reject missing name', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/update-membership?membershipid=${user.membership.membershipid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: '',
        email: owner.profile.contactEmail
      }
      let errorMessage
      try {
        await req.route.api.patch(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-membership-name')
    })

    it('should enforce name length', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/update-membership?membershipid=${user.membership.membershipid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: '12345',
        email: owner.profile.contactEmail
      }
      global.minimumMembershipNameLength = 100
      let errorMessage
      try {
        await req.route.api.patch(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-membership-name-length')
      global.maximumMembershipNameLength = 1
      errorMessage = null
      try {
        await req.route.api.patch(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-membership-name-length')
    })

    it('should reject missing email', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/update-membership?membershipid=${user.membership.membershipid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        name: owner.profile.firstName,
        email: null
      }
      let errorMessage
      try {
        await req.route.api.patch(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-membership-email')
    })

    it('should apply new values', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/update-membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        name: 'Person',
        email: 'test@test.com'
      }
      const membershipNow = await req.patch(req)
      assert.strictEqual(membershipNow.name, 'Person')
      assert.strictEqual(membershipNow.email, 'test@test.com')
    })
  })
})
