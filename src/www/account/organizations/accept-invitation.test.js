/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/account/organizations/accept-invitation`, () => {
  describe('AcceptInvitation#GET', () => {
    it('should present the form', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation`)
      req.account = user.account
      req.session = user.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      assert.strictEqual(doc.getElementById('submit-form').tag, 'form')
      assert.strictEqual(doc.getElementById('submit-button').tag, 'button')
    })
  })

  describe('AcceptInvitation#POST', () => {
    it('should reject missing name', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code,
        email: user.profile.email,
        name: null,
        invitationid: owner.invitation.invitationid
      }
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-membership-name')
    })

    it('should enforce name length', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code,
        email: user.profile.email,
        name: `1`,
        invitationid: owner.invitation.invitationid
      }
      global.minimumMembershipNameLength = 2
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-membership-name-length')
      // too long
      const req2 = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req2.account = user.account
      req2.session = user.session
      req2.body = {
        code: owner.invitation.code,
        email: user.profile.email,
        name: `1234567890`,
        invitationid: owner.invitation.invitationid
      }
      global.maximumMembershipNameLength = 1
      const page2 = await req.post(req)
      const doc2 = TestHelper.extractDoc(page2)
      const message2 = doc2.getElementById('message-container').child[0]
      assert.strictEqual(message2.attr.template, 'invalid-membership-name-length')
    })

    it('should reject missing email', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.session = user.session
      req.account = user.account
      req.body = {
        code: owner.invitation.code,
        email: null,
        name: `${user.profile.firstName} ${user.profile.lastName.substring(0, 1)}`,
        invitationid: owner.invitation.invitationid
      }
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const message = doc.getElementById('message-container').child[0]
      assert.strictEqual(message.attr.template, 'invalid-membership-email')
    })

    it('should reject owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        code: owner.invitation.code,
        email: owner.profile.email,
        name: `${owner.profile.firstName} ${owner.profile.lastName.substring(0, 1)}`,
        invitationid: owner.invitation.invitationid
      }
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-account')
    })

    it('should reject existing member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner)
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code,
        email: user.profile.email,
        name: `${user.profile.firstName} ${user.profile.lastName.substring(0, 1)}`,
        invitationid: owner.invitation.invitationid
      }
      const page = await req.post(req)
      const doc = TestHelper.extractDoc(page)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-account')
    })

    it('should accept invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        code: owner.invitation.code,
        email: user.profile.email,
        name: `${user.profile.firstName} ${user.profile.lastName.substring(0, 1)}`,
        invitationid: owner.invitation.invitationid
      }
      const page = await req.post(req)
      const redirectURL = await TestHelper.extractRedirectURL(page)
      assert.strictEqual(true, redirectURL.startsWith(`/account/organizations/membership?membershipid=`))
    })
  })
})
