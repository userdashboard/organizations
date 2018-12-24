/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/account/organizations/delete-membership`, async () => {
  describe('DeleteMembership#BEFORE', () => {
    it('should reject non-member non-owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/delete-membership?membershipid=${user.membership.membershipid}`)
      req.account = user2.account
      req.session = user2.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should bind organization to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/delete-membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.organization.organizationid, owner.organization.organizationid)
    })
  })

  describe('DeleteMembership#GET', () => {
    it('should present the form', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/delete-membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      assert.strictEqual(doc.getElementById('submit-form').tag, 'form')
      assert.strictEqual(doc.getElementById('submit-button').tag, 'button')

    })

    it('should present the membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/delete-membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const row = doc.getElementById(user.membership.membershipid)
      assert.strictEqual(row.tag, 'tr')
    })
  })

  describe('DeleteMembership#POST', () => {
    it('should delete membership for member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/delete-membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      await req.post(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`)
      req2.account = owner.account
      req2.session = owner.session
      const membership = await req2.get(req2)
      assert.strictEqual(membership.message, 'invalid-membershipid')
    })

    it('should delete membership for organization owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/delete-membership?membershipid=${user.membership.membershipid}`)
      req.account = owner.account
      req.session = owner.session
      await req.post(req)
      const req2 = TestHelper.createRequest(`/api/user/organizations/membership?membershipid=${user.membership.membershipid}`)
      req2.account = owner.account
      req2.session = owner.session
      const membership = await req2.get(req2)
      assert.strictEqual(membership.message, 'invalid-membershipid')
    })
  })
})
