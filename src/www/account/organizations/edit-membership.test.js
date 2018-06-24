/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/account/organizations/edit-membership`, () => {
  describe('EditMembership#BEFORE', () => {
    it('should require own membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const user2 = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/edit-membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = user2.account
      req.session = user2.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membership')
    })

    it('should bind membership to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = user.account
      req.session = user.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.membership, null)
      assert.equal(req.data.membership.accountid, user.account.accountid)
    })
  })

  describe('EditMembership#GET', () => {
    it('should present the form', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership?membershipid=${user.membership.membershipid}`, 'GET')
      req.account = user.account
      req.session = user.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        assert.notEqual(null, doc.getElementById('email'))
        assert.notEqual(null, doc.getElementById('submit-form'))
        assert.notEqual(null, doc.getElementById('submit-button'))
      }
      return req.route.api.get(req, res)
    })
  })

  describe('EditMembership#POST', () => {
    it('should reject invalid fields', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership?membershipid=${user.membership.membershipid}`, 'POST')
      req.session = user.session
      req.account = user.account
      req.body = {
        invalid: 'field'
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        const message = doc.getElementById('message-container').child[0]
        assert.equal('invalid-membership-field', message.attr.template)
      }
      return req.route.api.post(req, res)
    })

    it('should enforce field length', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership?membershipid=${user.membership.membershipid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        email: 'toooooooo_loooooooooooooooong@email-address.com'
      }
      global.MAXIMUM_MEMBERSHIP_FIELD_LENGTH = 10
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        const message = doc.getElementById('message-container').child[0]
        assert.equal('invalid-membership-field-length', message.attr.template)
      }
      return req.route.api.post(req, res)
    })

    it('should apply after authorization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/edit-membership?membershipid=${user.membership.membershipid}`, 'POST')
      req.account = user.account
      req.session = user.session
      req.body = {
        email: 'email@address.com'
      }
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        req.session = await TestHelper.unlockSession(user)
        const res = TestHelper.createResponse()
        res.end = async (str) => {
          const doc = TestHelper.extractDoc(str)
          const messageContainer = doc.getElementById('message-container')
          assert.notEqual(null, messageContainer)
          assert.notEqual(null, messageContainer.child)
          const message = messageContainer.child[0]
          assert.equal('success', message.attr.template)
        }
        return req.route.api.get(req, res)
      }
      return req.route.api.post(req, res)
    })
  })
})
