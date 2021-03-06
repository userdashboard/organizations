/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/account/organizations/accept-invitation', () => {
  describe('view', () => {
    it('should present the form', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/organizations/accept-invitation')
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
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
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      assert.strictEqual(doc.toString().indexOf(user.profile.profileid), -1)
    })
  })

  describe('submit', () => {
    it('should accept valid existing profile', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-name', 'display-email']
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
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should accept invitation and create profile (screenshots)', async () => {
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
      req.filename = __filename
      req.screenshots = [
        { hover: '#account-menu-container' },
        { click: '/account/organizations' },
        { click: '/account/organizations/accept-invitation' },
        { fill: '#submit-form' }
      ]
      global.membershipProfileFields = ['display-name', 'display-email']
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })
  })

  describe('errors', () => {
    it('invalid-account', async () => {
      const owner = await TestHelper.createUser()
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
      req.account = owner.account
      req.session = owner.session
      req.body = {
        'secret-code': owner.invitation.secretCode,
        invitationid: owner.invitation.invitationid
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-account')
      const member = await TestHelper.createUser()
      await TestHelper.createProfile(member, {
        'display-name': 'Person',
        'display-email': 'person@email.com'
      })
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(member, owner)
      await TestHelper.createInvitation(owner)
      req.account = member.account
      req.session = member.session
      req.body = {
        'secret-code': owner.invitation.secretCode,
        invitationid: owner.invitation.invitationid,
        profileid: member.profile.profileid
      }
      const result2 = await req.post()
      const doc2 = TestHelper.extractDoc(result2.html)
      const messageContainer2 = doc2.getElementById('message-container')
      const message2 = messageContainer2.child[0]
      assert.strictEqual(message2.attr.template, 'invalid-account')
    })
  })
})
