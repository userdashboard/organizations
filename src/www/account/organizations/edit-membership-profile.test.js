/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/account/organizations/edit-membership-profile', () => {
  describe('view', () => {
    it('should present the form', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      assert.strictEqual(doc.getElementById('submit-form').tag, 'form')
      assert.strictEqual(doc.getElementById('submit-button').tag, 'button')
    })

    it('should have elements for full-name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(owner, {
        'first-name': owner.profile.firstName,
        'last-name': owner.profile.lastName
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(user, {
        'first-name': user.profile.firstName,
        'last-name': user.profile.lastName
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const inputContainer = doc.getElementById('full-name-container')
      assert.strictEqual(inputContainer.tag, 'div')
    })

    it('should have elements for display-name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-name']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-name']
      await TestHelper.createProfile(user, {
        'display-name': 'displayname'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const inputContainer = doc.getElementById('display-name-container')
      assert.strictEqual(inputContainer.tag, 'div')
    })

    it('should have elements for contact-email', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['contact-email']
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['contact-email']
      await TestHelper.createProfile(user, {
        'contact-email': user.profile.contactEmail
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const inputContainer = doc.getElementById('contact-email-container')
      assert.strictEqual(inputContainer.tag, 'div')
    })

    it('should have elements for display-email', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-email']
      await TestHelper.createProfile(owner, {
        'display-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-email']
      await TestHelper.createProfile(user, {
        'display-email': user.profile.contactEmail
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const inputContainer = doc.getElementById('display-email-container')
      assert.strictEqual(inputContainer.tag, 'div')
    })

    it('should have elements for dob', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['dob']
      await TestHelper.createProfile(owner, {
        dob: '10-28-2000'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['dob']
      await TestHelper.createProfile(user, {
        dob: '10-28-2000'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const inputContainer = doc.getElementById('dob-container')
      assert.strictEqual(inputContainer.tag, 'div')
    })

    it('should have elements for phone', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['phone']
      await TestHelper.createProfile(owner, {
        phone: '456-789-0123'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['phone']
      await TestHelper.createProfile(user, {
        phone: '456-789-0123'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const inputContainer = doc.getElementById('phone-container')
      assert.strictEqual(inputContainer.tag, 'div')
    })

    it('should have elements for occupation', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['occupation']
      await TestHelper.createProfile(owner, {
        occupation: 'Worker'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['occupation']
      await TestHelper.createProfile(user, {
        occupation: 'Worker'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const inputContainer = doc.getElementById('occupation-container')
      assert.strictEqual(inputContainer.tag, 'div')
    })

    it('should have elements for location', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['location']
      await TestHelper.createProfile(owner, {
        location: 'Location 1'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['location']
      await TestHelper.createProfile(user, {
        location: 'Location 2'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const inputContainer = doc.getElementById('location-container')
      assert.strictEqual(inputContainer.tag, 'div')
    })

    it('should have elements for company-name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['company-name']
      await TestHelper.createProfile(owner, {
        'company-name': 'Company 1'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['company-name']
      await TestHelper.createProfile(user, {
        'company-name': 'Company 2'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const inputContainer = doc.getElementById('company-name-container')
      assert.strictEqual(inputContainer.tag, 'div')
    })

    it('should have elements for website', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['website']
      await TestHelper.createProfile(owner, {
        website: 'http://website.com'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['website']
      await TestHelper.createProfile(user, {
        website: 'http://website2.com'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const inputContainer = doc.getElementById('website-container')
      assert.strictEqual(inputContainer.tag, 'div')
    })
  })

  describe('submit', () => {
    it('should update profile (screenshots)', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name', 'display-name', 'contact-email', 'display-email', 'dob', 'phone', 'occupation', 'location', 'company-name', 'website']
      await TestHelper.createProfile(owner, {
        'first-name': 'Test',
        'last-name': 'Person',
        'contact-email': 'test1@test.com',
        'display-email': 'test2@test.com',
        dob: '2000-01-01',
        'display-name': 'tester',
        phone: '456-789-0123',
        occupation: 'Programmer',
        location: 'USA',
        'company-name': 'Test company',
        website: 'https://example.com',
        default: 'true'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name', 'display-name', 'contact-email', 'display-email', 'dob', 'phone', 'occupation', 'location', 'company-name', 'website']
      await TestHelper.createProfile(user, {
        'first-name': 'Organization',
        'last-name': 'Owner',
        'contact-email': 'test1@test.com',
        'display-email': 'test2@test.com',
        dob: '2000-01-01',
        'display-name': 'tester',
        phone: '456-789-0123',
        occupation: 'Owner',
        location: 'USA',
        'company-name': 'Test company',
        website: 'https://example.com',
        default: 'true'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'first-name': 'Test',
        'last-name': 'Person',
        'contact-email': 'test3@test.com',
        'display-email': 'test3@test.com',
        dob: '2000-01-01',
        'display-name': 'tester',
        phone: '456-789-0123',
        occupation: 'Programmer',
        location: 'USA',
        'company-name': 'Test company',
        website: 'https://example.com',
        default: 'true'
      }
      req.filename = __filename
      req.screenshots = [
        { hover: '#account-menu-container' },
        { click: '/account/organizations' },
        { click: '/account/organizations/memberships' },
        { click: `/account/organizations/membership?membershipid=${user.membership.membershipid}` },
        { click: `/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}` },
        { fill: '#submit-form' }
      ]
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with full-name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(owner, {
        'first-name': owner.profile.firstName,
        'last-name': owner.profile.lastName
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(user, {
        'first-name': user.profile.firstName,
        'last-name': user.profile.lastName
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'first-name': 'Test',
        'last-name': 'Person'
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with display name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-name']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const identity = user.profile
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'display-name': identity.firstName + ' ' + identity.lastName.substring(0, 1)
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with contact-email', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['contact-email']
      await TestHelper.createProfile(owner, {
        'contact-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createProfile(user, {
        'contact-email': user.profile.contactEmail
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'contact-email': user.profile.contactEmail
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with display-email', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-email']
      await TestHelper.createProfile(owner, {
        'display-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-email']
      await TestHelper.createProfile(user, {
        'display-email': user.profile.contactEmail
      })
      await TestHelper.acceptInvitation(user, owner)

      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'display-email': user.profile.displayEmail
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with dob in YYYY-MM-DD', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['dob']
      await TestHelper.createProfile(owner, {
        dob: '10-28-2000'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['dob']
      await TestHelper.createProfile(user, {
        dob: '10-28-2000'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        dob: '2017-11-01'
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with dob in MM-DD-YYYY', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['dob']
      await TestHelper.createProfile(owner, {
        dob: '12-25-2000'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['dob']
      await TestHelper.createProfile(user, {
        dob: '12-24-2000'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        dob: '12-23-2000'
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with phone', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['phone']
      await TestHelper.createProfile(owner, {
        phone: '456-789-0123'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['phone']
      await TestHelper.createProfile(user, {
        phone: '456-789-0123'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        phone: 'test value ' + Math.random()
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with occupation', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['occupation']
      await TestHelper.createProfile(owner, {
        occupation: 'Worker'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['occupation']
      await TestHelper.createProfile(user, {
        occupation: 'Worker'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        occupation: 'test value ' + Math.random()
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with location', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['location']
      await TestHelper.createProfile(owner, {
        location: 'Location 1'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['location']
      await TestHelper.createProfile(user, {
        location: 'Location 2'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        location: 'test value ' + Math.random()
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with company-name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['company-name']
      await TestHelper.createProfile(owner, {
        'company-name': 'Company 1'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['company-name']
      await TestHelper.createProfile(user, {
        'company-name': 'Company 2'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'company-name': 'test value ' + Math.random()
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })

    it('should update profile with website', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['website']
      await TestHelper.createProfile(owner, {
        website: 'http://website.com'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['website']
      await TestHelper.createProfile(user, {
        website: 'http://website2.com'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        website: 'test value ' + Math.random()
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })
  })

  describe('errors', () => {
    it('invalid-first-name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(owner, {
        'first-name': owner.profile.firstName,
        'last-name': owner.profile.lastName
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(user, {
        'first-name': user.profile.firstName,
        'last-name': user.profile.lastName
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'first-name': '',
        'last-name': 'Test'
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-first-name')
    })

    it('invalid-first-name-length', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(owner, {
        'first-name': owner.profile.firstName,
        'last-name': owner.profile.lastName
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(user, {
        'first-name': user.profile.firstName,
        'last-name': user.profile.lastName
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'first-name': '1',
        'last-name': 'Test'
      }
      global.minimumProfileFirstNameLength = 10
      global.maximumProfileFirstNameLength = 100
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-first-name-length')
      global.minimumProfileFirstNameLength = 1
      global.maximumProfileFirstNameLength = 1
      req.body = {
        'first-name': '123456789',
        'last-name': 'Test'
      }
      const result2 = await req.post()
      const doc2 = TestHelper.extractDoc(result2.html)
      const messageContainer2 = doc2.getElementById('message-container')
      const message2 = messageContainer2.child[0]
      assert.strictEqual(message2.attr.template, 'invalid-first-name-length')
    })

    it('invalid-last-name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(owner, {
        'first-name': owner.profile.firstName,
        'last-name': owner.profile.lastName
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(user, {
        'first-name': user.profile.firstName,
        'last-name': user.profile.lastName
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'first-name': 'Test',
        'last-name': ''
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-last-name')
    })

    it('invalid-last-name-length', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(owner, {
        'first-name': owner.profile.firstName,
        'last-name': owner.profile.lastName
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['full-name']
      await TestHelper.createProfile(user, {
        'first-name': user.profile.firstName,
        'last-name': user.profile.lastName
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'first-name': '1',
        'last-name': 'Test'
      }
      global.minimumProfileLastNameLength = 10
      global.maximumProfileLastNameLength = 100
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-last-name-length')
      global.minimumProfileLastNameLength = 1
      global.maximumProfileLastNameLength = 1
      req.body = {
        'first-name': '123456789',
        'last-name': 'Test'
      }
      const result2 = await req.post()
      const doc2 = TestHelper.extractDoc(result2.html)
      const messageContainer2 = doc2.getElementById('message-container')
      const message2 = messageContainer2.child[0]
      assert.strictEqual(message2.attr.template, 'invalid-last-name-length')
    })

    it('invalid-contact-email', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['contact-email']
      await TestHelper.createProfile(owner, {
        'contact-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['contact-email']
      await TestHelper.createProfile(user, {
        'contact-email': user.profile.contactEmail
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'contact-email': ''
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-contact-email')
      req.body = {
        'contact-email': 'invalid'
      }
      const result2 = await req.post()
      const doc2 = TestHelper.extractDoc(result2.html)
      const messageContainer2 = doc2.getElementById('message-container')
      const message2 = messageContainer2.child[0]
      assert.strictEqual(message2.attr.template, 'invalid-contact-email')
    })

    it('invalid-display-email', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-email']
      await TestHelper.createProfile(owner, {
        'display-email': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-email']
      await TestHelper.createProfile(user, {
        'display-email': user.profile.contactEmail
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'display-email': ''
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-display-email')
      req.body = {
        'display-email': 'invalid'
      }
      const result2 = await req.post()
      const doc2 = TestHelper.extractDoc(result2.html)
      const messageContainer2 = doc2.getElementById('message-container')
      const message2 = messageContainer2.child[0]
      assert.strictEqual(message2.attr.template, 'invalid-display-email')
    })

    it('invalid-display-name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-name']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.contactEmail
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'display-name': ''
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-display-name')
    })

    it('invalid-display-name-length', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-name']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.contactEmail
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.contactEmail
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'display-name': '1'
      }
      global.minimumProfileDisplayNameLength = 10
      global.maximumProfileDisplayNameLength = 100
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-display-name-length')
      global.minimumProfileDisplayNameLength = 1
      global.maximumProfileDisplayNameLength = 1
      req.body = {
        'display-name': '123456789'
      }
      const result2 = await req.post()
      const doc2 = TestHelper.extractDoc(result2.html)
      const messageContainer2 = doc2.getElementById('message-container')
      const message2 = messageContainer2.child[0]
      assert.strictEqual(message2.attr.template, 'invalid-display-name-length')
    })

    it('invalid-dob', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['dob']
      await TestHelper.createProfile(owner, {
        dob: '10-28-2000'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['dob']
      await TestHelper.createProfile(user, {
        dob: '10-28-2000'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        dob: ''
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-dob')
      req.body = {
        dob: '2017-13-52'
      }
      const result2 = await req.post()
      const doc2 = TestHelper.extractDoc(result2.html)
      const messageContainer2 = doc2.getElementById('message-container')
      const message2 = messageContainer2.child[0]
      assert.strictEqual(message2.attr.template, 'invalid-dob')
    })

    it('invalid-phone', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['phone']
      await TestHelper.createProfile(owner, {
        phone: '456-789-0123'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['phone']
      await TestHelper.createProfile(user, {
        phone: '456-789-0123'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        phone: ''
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-phone')
    })

    it('invalid-occupation', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['occupation']
      await TestHelper.createProfile(owner, {
        occupation: 'Worker'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['occupation']
      await TestHelper.createProfile(user, {
        occupation: 'Worker'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        occupation: ''
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-occupation')
    })

    it('invalid-location', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['location']
      await TestHelper.createProfile(owner, {
        location: 'Location 1'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['location']
      await TestHelper.createProfile(user, {
        location: 'Location 2'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        location: ''
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-location')
    })

    it('invalid-company-name', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['company-name']
      await TestHelper.createProfile(owner, {
        'company-name': 'Company 1'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['company-name']
      await TestHelper.createProfile(user, {
        'company-name': 'Company 2'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        'company-name': ''
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-company-name')
    })

    it('invalid-website', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['website']
      await TestHelper.createProfile(owner, {
        website: 'http://website.com'
      })
      await TestHelper.createOrganization(owner, {
        email: 'test@email.com',
        name: 'My organization',
        profileid: owner.profile.profileid
      })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['website']
      await TestHelper.createProfile(user, {
        website: 'http://website2.com'
      })
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership-profile?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        website: ''
      }
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'invalid-website')
    })
  })
})
