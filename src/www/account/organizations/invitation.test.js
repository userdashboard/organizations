/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/account/organizations/invitation`, () => {
  describe('Invitation#BEFORE', () => {
    it('should require owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should bind invitation to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/account/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = owner.account
      req.session = owner.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.invitation.invitationid, owner.invitation.invitationid)
    })
  })

  describe('Invitation#GET', () => {
    it('should have row for invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/account/organizations/invitation?invitationid=${owner.invitation.invitationid}`)
      req.account = owner.account
      req.session = owner.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const tbody = doc.getElementById(owner.invitation.invitationid)
      assert.strictEqual(tbody.tag, 'tbody')
    })
  })
})
