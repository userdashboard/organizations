/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/administrator/organizations/invitation`, () => {
  it('should require an administrator', TestHelper.requireAdministrator(`/administrator/organizations/invitation`))
  it('should require an invitationid', TestHelper.requireParameter(`/administrator/organizations/invitation`, 'invitationid'))
  describe('Invitation#BEFORE', () => {
    it('should bind invitation to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      await TestHelper.createInvitation(administrator, administrator.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/invitation?invitationid=${administrator.invitation.invitationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.invitation, null)
      assert.equal(req.data.invitation.invitationid, administrator.invitation.invitationid)
    })
  })

  describe('Invitation#GET', () => {
    it('should have row for invitation', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      await TestHelper.createInvitation(administrator, administrator.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/invitation?invitationid=${administrator.invitation.invitationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const invitationRow = doc.getElementById(administrator.invitation.invitationid)
        assert.notEqual(null, invitationRow)
      }
      await req.route.api.before(req)
      return req.route.api.get(req, res)
    })
  })
})
