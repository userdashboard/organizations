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
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      assert.strictEqual(doc.getElementById('submit-form').tag, 'form')
      assert.strictEqual(doc.getElementById('submit-button').tag, 'button')
    })

    it('should exclude invalid profiles', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
       await TestHelper.createOrganization(owner, {
        name: 'org-name',
        email: 'test@test.com',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      global.membershipProfileFields = ['full-name', 'contact-email']
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      assert.strictEqual(doc.toString().indexOf(user.profile.profileid), -1)
    })

  })

  describe('AcceptInvitation#POST', () => {
    it('should reject owner', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = [ 'display-name', 'display-email' ]
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: owner.profile.displayEmail,
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        'secret-code': owner.invitation.secretCode,
        invitationid: owner.invitation.invitationid
      }
      const page = await req.post()
      const doc = TestHelper.extractDoc(page)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-account')
    })

    it('should reject existing member', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = [ 'display-name', 'display-email' ]
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: owner.profile.displayEmail,
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createProfile(user, {
        'display-name': 'Person',
        'display-email': 'person@email.com'
      })
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'secret-code': owner.invitation.secretCode,
        invitationid: owner.invitation.invitationid,
        profileid: user.profile.profileid
      }
      const page = await req.post()
      const doc = TestHelper.extractDoc(page)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-account')
    })

    it('should accept valid existing profile', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      global.userProfileFields = [ 'display-name', 'display-email' ]
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: owner.profile.displayEmail,
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'secret-code': owner.invitation.secretCode,
        invitationid: owner.invitation.invitationid,
        profileid: user.profile.profileid
      }
      const page = await req.post()
      const redirectURL = await TestHelper.extractRedirectURL(page)
      assert.strictEqual(true, redirectURL.startsWith(`/account/organizations/membership?membershipid=`))
    })

    it('should accept invitation and create profile', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: owner.profile.displayEmail,
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/account/organizations/accept-invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'secret-code': owner.invitation.secretCode,
        invitationid: owner.invitation.invitationid,
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      }
      global.membershipProfileFields = ['display-name', 'display-email']
      const page = await req.post()
      const redirectURL = await TestHelper.extractRedirectURL(page)
      assert.strictEqual(true, redirectURL.startsWith(`/account/organizations/membership?membershipid=`))
    })
  })
})
