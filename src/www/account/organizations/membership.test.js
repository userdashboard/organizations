/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/account/organizations/membership`, () => {
  describe('Membership#BEFORE', () => {
    it('should reject non-member', async () => {
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
      await TestHelper.acceptInvitation(user, owner)
      global.userProfileFields = ['contact-email', 'full-name']
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/membership?membershipid=${user.membership.membershipid}`)
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

    it('should bind membership to req', async () => {
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
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.membership.membershipid, user.membership.membershipid)
    })
  })

  describe('Membership#GET', () => {
    it('should have row for membership', async () => {
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
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      const tbody = doc.getElementById(user.membership.membershipid)
      assert.strictEqual(tbody.tag, 'tbody')
    })

    it('should show profile fields if data exists', async () => {
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
      await TestHelper.acceptInvitation(user, owner)
      const fields = {
        dob: '2000-01-01',
        phone: '456-789-0123',
        occupation: 'Programmer',
        location: 'USA',
        'company-name': user.profile.displayEmail.split('@')[1].split('.')[0],
        website: 'https://' + user.profile.displayEmail.split('@')[1]
      }
      const req = TestHelper.createRequest(`/account/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      for (const field in fields) {
        assert.strictEqual(doc.getElementById(field), undefined)
      }
      const body = {
        'display-name': user.profile.displayName,
        'display-email': user.profile.displayEmail
      }
      for (const field in fields) {
        global.userProfileFields = global.membershipProfileFields = ['display-name', 'display-email', field]
        if (field === 'full-name') {
          body['first-name'] = 'First'
          body['last-name'] = 'Last'
        } else {
          body[field] = fields[field]
        }
        const req3 = TestHelper.createRequest(`/api/user/update-profile?profileid=${user.membership.profileid}`)
        req3.account = user.account
        req3.session = user.session
        req3.body = body
        user.profile = await req3.patch()
        const req2 = TestHelper.createRequest(`/account/organizations/membership?membershipid=${user.membership.membershipid}`)
        req2.account = user.account
        req2.session = user.session
        const page2 = await req2.get()
        const doc2 = TestHelper.extractDoc(page2)
        assert.strictEqual(doc2.getElementById('display-email').tag, 'tr')
        assert.strictEqual(doc2.getElementById('display-name').tag, 'tr')
        assert.strictEqual(doc2.getElementById(field).tag, 'tr')
      }
    })
  })
})
