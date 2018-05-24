/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/administrator/organizations/invitation`, () => {
  describe('Invitation#BEFORE', () => {
    it('should bind invitation to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.invitation, null)
      assert.equal(req.data.invitation.invitationid, owner.invitation.invitationid)
    })
  })

  describe('Invitation#GET', () => {
    it('should have row for invitation', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/invitation?invitationid=${owner.invitation.invitationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const invitationRow = doc.getElementById(owner.invitation.invitationid)
        assert.notEqual(null, invitationRow)
      }
      return req.route.api.get(req, res)
    })
  })
})
