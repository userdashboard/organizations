/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/account/organizations/delete-invitation`, async () => {
  describe('DeleteInvitation#BEFORE', () => {
    it('should require owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-account')
    })

    it('should bind organization to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/account/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.organization, null)
      assert.equal(req.data.organization.organizationid, owner.organization.organizationid)
    })
  })

  describe('DeleteInvitation#GET', () => {
    it('should present the form', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/account/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        assert.notEqual(null, doc.getElementById('submit-form'))
        assert.notEqual(null, doc.getElementById('submit-button'))
      }
      return req.route.api.get(req, res)
    })

    it('should present the invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/account/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const row = doc.getElementById(owner.invitation.invitationid)
        assert.notEqual(null, row)
      }
      return req.route.api.get(req, res)
    })
  })

  describe('DeleteInvitation#POST', () => {
    it('should delete invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/account/organizations/delete-invitation?invitationid=${owner.invitation.invitationid}`, 'POST')
      req.account = owner.account
      req.session = owner.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        await TestHelper.completeAuthorization(req)
        const res2 = TestHelper.createResponse()
        res2.end = async (str) => {
          const doc = TestHelper.extractDoc(str)
          const messageContainer = doc.getElementById('message-container')
          assert.notEqual(null, messageContainer)
          assert.notEqual(null, messageContainer.child)
          const message = messageContainer.child[0]
          assert.equal('success', message.attr.template)
        }
        return req.route.api.post(req, res2)
      }
      return req.route.api.post(req, res)
    })
  })
})