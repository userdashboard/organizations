/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/user/organizations/create-invitation`, () => {
  describe('CreateInvitation#POST', () => {
    it('should enforce code length', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`, 'POST')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        code: '1'
      }
      global.MINIMUM_INVITATION_CODE_LENGTH = 100
      try {
        await req.route.api.post(req)
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation-code-length')
      } finally {
        global.MINIMUM_INVITATION_CODE_LENGTH = 1
      }
    })

    it('should create authorized invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`, 'POST')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        code: 'this-is-the-code'
      }
      await req.route.api.post(req)
      await TestHelper.completeAuthorization(req)
      const invitation = await req.route.api.post(req)
      assert.notEqual(invitation, null)
      assert.notEqual(invitation.invitationid, null)
    })
  })
})
