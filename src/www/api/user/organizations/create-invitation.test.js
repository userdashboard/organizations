/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/create-invitation`, () => {
  describe('CreateInvitation#BEFORE', () => {
    it('should enforce code length', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        code: '1'
      }
      global.minimumInvitationCodeLength = 100
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-invitation-code-length')
    })
  })

  describe('CreateInvitation#POST', () => {
    it('should create authorized invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        code: 'this-is-the-code'
      }
      const invitation = await req.post(req)
      assert.strictEqual(invitation.object, 'invitation')
    })
  })
})
