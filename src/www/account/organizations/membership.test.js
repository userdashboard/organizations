/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/account/organizations/membership', () => {
  describe('before', () => {
    it('should reject non-member', async () => {
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

    it('should bind data to req', async () => {
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
      const req = TestHelper.createRequest(`/account/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.membership.membershipid, user.membership.membershipid)
    })
  })

  describe('view', () => {
    it('should have row for membership (screenshots)', async () => {
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
      const req = TestHelper.createRequest(`/account/organizations/membership?membershipid=${user.membership.membershipid}`)
      req.account = user.account
      req.session = user.session
      req.filename = __filename
      req.screenshots = [
        { hover: '#account-menu-container' },
        { click: '/account/organizations' },
        { click: '/account/organizations/memberships' },
        { click: `/account/organizations/membership?membershipid=${user.membership.membershipid}` }
      ]
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      const tbody = doc.getElementById(user.membership.membershipid)
      assert.strictEqual(tbody.tag, 'tbody')
    })

    it('should show profile fields if data exists', async () => {
      const owner = await TestHelper.createUser()
      global.userProfileFields = global.membershipProfileFields = ['display-name', 'display-email']
      await TestHelper.createProfile(owner, {
        'display-name': owner.profile.firstName,
        'display-email': owner.profile.contactEmail
      })
      const fields = {
        dob: '2000-01-01',
        phone: '456-789-0123',
        occupation: 'Programmer',
        location: 'USA',
        'company-name': 'company-name',
        website: 'https://website.com'
      }
      const user = await TestHelper.createUser()
      for (const field in fields) {
        global.userProfileFields = global.membershipProfileFields = ['display-name', 'display-email']
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        await TestHelper.createInvitation(owner)
        global.userProfileFields = global.membershipProfileFields = [field]
        await TestHelper.createProfile(user, {
          [field]: fields[field]
        })
        await TestHelper.acceptInvitation(user, owner)
        const req = TestHelper.createRequest(`/account/organizations/membership?membershipid=${user.membership.membershipid}`)
        req.account = user.account
        req.session = user.session
        const result = await req.get()
        const doc = TestHelper.extractDoc(result.html)
        assert.strictEqual(doc.getElementById(field).tag, 'tr')
      }
    })
  })
})
