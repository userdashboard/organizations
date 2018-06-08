/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/administrator/organizations/organization-invitations`, () => {
  describe('OrganizationInvitations#BEFORE', () => {
    it('should bind invitations to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.invitations, null)
      assert.equal(req.data.invitations.length, 1)
      assert.equal(req.data.invitations[0].invitationid, owner.invitation.invitationid)
    })
  })

  describe('OrganizationInvitations#GET', () => {
    it('should have row for invitation', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`, 'GET')
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

    it('should limit invitations to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = 20; i < len; i++) {
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const table = doc.getElementById('invitations-table')
        const rows = table.getElementsByTagName('tr')
        assert.equal(rows.length, global.PAGE_SIZE + 1)
      }
      return req.route.api.get(req, res)
    })

    it('should enforce page size', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = 20; i < len; i++) {
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/organization-invitations?organizationid=${owner.organization.organizationid}`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      global.PAGE_SIZE = 8
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const table = doc.getElementById('invitations-table')
        const rows = table.getElementsByTagName('tr')
        assert.equal(rows.length, 8 + 1)
      }
      return req.route.api.get(req, res)
    })

    it('should enforce specified offset', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const invitations = []
      for (let i = 0, len = 30; i < len; i++) {
        const invitation = await TestHelper.createInvitation(owner, owner.organization.organizationid)
        invitations.unshift(invitation)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/organization-invitations?organizationid=${owner.organization.organizationid}&offset=10`, 'GET')
      req.account = administrator.account
      req.session = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        for (let i = 0, len = 10; i < len; i++) {
          assert.notEqual(null, doc.getElementById(invitations[10 + i].invitationid))
        }
      }
      return req.route.api.get(req, res)
    })
  })
})
