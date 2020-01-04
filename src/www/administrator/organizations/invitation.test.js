/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/administrator/organizations/invitation', () => {
  describe('Invitation#BEFORE', () => {
    it('should bind invitation to req', async () => {
      const administrator = await TestHelper.createAdministrator()
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
      const req = TestHelper.createRequest(`/administrator/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.invitation.invitationid, owner.invitation.invitationid)
    })
  })

  describe('Invitation#GET', () => {
    it('should have row for invitation (screenshots)', async () => {
      const administrator = await TestHelper.createAdministrator()
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
      const req = TestHelper.createRequest(`/administrator/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = administrator.account
      req.session = administrator.session
      req.filename = __filename
      req.screenshots = [
        { hover: '#administrator-menu-container' },
        { click: '/administrator/organizations' },
        { click: '/administrator/organizations/invitations' },
        { click: `/administrator/organizations/invitation?invitationid=${owner.invitation.invitationid}` }
      ]
      const page = await req.get()
      const doc = TestHelper.extractDoc(page)
      const tbody = doc.getElementById(owner.invitation.invitationid)
      assert.strictEqual(tbody.tag, 'tbody')
    })
  })
})
