/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/account/organizations/memberships', () => {
  describe('Memberships#BEFORE', () => {
    it('should bind memberships to req', async () => {
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
      const req = TestHelper.createRequest('/account/organizations/memberships')
      req.account = user.account
      req.session = user.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.memberships[0.0].membershipid, user.membership.membershipid)
    })
  })

  describe('Memberships#GET', () => {
    it('should limit memberships to one page', async () => {
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const owner = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
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
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest('/account/organizations/memberships')
      req.account = user.account
      req.session = user.session
      req.filename = __filename
      req.screenshots = [
        { hover: '#account-menu-container' },
        { click: '/account/organizations' },
        { click: '/account/organizations/memberships' }
      ]
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('memberships-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const owner = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
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
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest('/account/organizations/memberships')
      req.account = user.account
      req.session = user.session
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('memberships-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce specified offset', async () => {
      global.delayDiskWrites = true
      const offset = 1
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      const memberships = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const owner = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
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
        await TestHelper.acceptInvitation(user, owner)
        memberships.unshift(user.membership.membershipid)
      }
      const req = TestHelper.createRequest(`/account/organizations/memberships?offset=${offset}`)
      req.account = user.account
      req.session = user.session
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(doc.getElementById(memberships[offset + i]).tag, 'tr')
      }
    })

    it('should show profile fields if data exists', async () => {
      const user = await TestHelper.createUser()
      global.userProfileFields = ['display-email', 'display-name']
      await TestHelper.createProfile(user, {
        'display-name': user.profile.firstName,
        'display-email': user.profile.contactEmail
      })
      const fields = {
        'full-name': 'First Last',
        'contact-email': 'contact@email.com',
        dob: '2000-01-01',
        phone: '456-789-0123',
        occupation: 'Programmer',
        location: 'USA',
        'company-name': user.profile.displayEmail.split('@')[1].split('.')[0],
        website: 'https://' + user.profile.displayEmail.split('@')[1]
      }
      const req = TestHelper.createRequest('/account/organizations/memberships')
      req.account = user.account
      req.session = user.session
      const usingFields = ['display-email', 'display-name']
      const postingBody = {
        'display-name': user.profile.displayName,
        'display-email': user.profile.displayEmail
      }
      for (const field in fields) {
        global.userProfileFields = ['contact-email', 'full-name']
        const owner = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(owner, {
          'display-name': owner.profile.firstName,
          'display-email': owner.profile.contactEmail
        })
        global.membershipProfileFields = ['display-email', 'display-name']
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        usingFields.push(field)
        if (field === 'full-name') {
          postingBody['first-name'] = fields[field].split(' ')[0]
          postingBody['last-name'] = fields[field].split(' ')[1]
        } else {
          postingBody[field] = fields[field]
        }
        global.userProfileFields = usingFields
        await TestHelper.createProfile(user, postingBody)
        await TestHelper.createInvitation(owner)
        global.membershipProfileFields = usingFields
        await TestHelper.acceptInvitation(user, owner)
        const page = await req.get()
        const doc = TestHelper.extractDoc(page)
        assert.strictEqual(doc.getElementById(`${field}-${user.membership.membershipid}`).tag, 'td')
      }
    })
  })
})
