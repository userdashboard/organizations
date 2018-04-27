/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/api/user/organizations/create-invitation`, () => {
  it('should require a user', TestHelper.requireAccount('/api/user/organizations/create-invitation'))
  it('should require an organizationid', TestHelper.requireParameter('/api/user/organizations/create-invitation', 'organizationid'))
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

    it('should lock session for authorization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`, 'POST')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        code: 'this-is-the-code'
      }
      await req.route.api.post(req)
      const req2 = TestHelper.createRequest(`/api/user/session?sessionid=${owner.session.sessionid}`, 'GET')
      req2.account = owner.account
      req2.session = owner.session
      const sessionNow = await req2.route.api.get(req2)
      assert.equal(sessionNow.lockURL, `/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`)
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
