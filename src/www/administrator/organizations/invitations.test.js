/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/administrator/organizations/invitations`, () => {
  it('should require an organizationid', TestHelper.requireParameter(`/administrator/organizations/invitations`, 'organizationid'))
  describe('Invitations#BEFORE', () => {
    it('should bind invitations to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      await TestHelper.createInvitation(administrator, administrator.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/invitations?organizationid=${administrator.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.invitations, null)
      assert.equal(req.data.invitations.length, 1)
      assert.equal(req.data.invitations[0].invitationid, administrator.invitation.invitationid)
    })
  })

  describe('Invitations#GET', () => {
    it('should have row for invitation', async () => {
      const administrator = await TestHelper.createAdministrator()
      await TestHelper.createOrganization(administrator)
      await TestHelper.createInvitation(administrator, administrator.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/invitations?organizationid=${administrator.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const invitationRow = doc.getElementById(administrator.invitation.invitationid)
        assert.notEqual(null, invitationRow)
      }
      return req.route.api.get(req, res)
    })
  })
})
