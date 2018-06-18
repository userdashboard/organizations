/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe(`/administrator/organizations/invitations`, () => {
  describe('Invitations#BEFORE', () => {
    it('should bind invitations to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/invitations`, 'GET')
      req.account = req.administrator = administrator.account
      req.session = req.administratorSession = administrator.session
      await req.route.api.before(req)
      assert.notEqual(req.data, null)
      assert.notEqual(req.data.invitations, null)
      assert.equal(req.data.invitations.length, 1)
      assert.equal(req.data.invitations[0].invitationid, owner.invitation.invitationid)
    })
  })

  describe('Invitations#GET', () => {
    it('should have row for invitation', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const invitation1 = await TestHelper.createInvitation(owner, owner.organization.organizationid)
      await TestHelper.createOrganization(owner)
      const invitation2 = await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const invitation3 = await TestHelper.createInvitation(owner, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/administrator/organizations/invitations`, 'GET')
      req.account = req.administrator = administrator.account
      req.session = req.administratorSession = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        const invitation1Row = doc.getElementById(invitation1.invitationid)
        assert.notEqual(null, invitation1Row)
        const invitation2Row = doc.getElementById(invitation2.invitationid)
        assert.notEqual(null, invitation2Row)
        const invitation3Row = doc.getElementById(invitation3.invitationid)
        assert.notEqual(null, invitation3Row)
      }
      return req.route.api.get(req, res)
    })

    it('should limit invitations to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = 10; i < len; i++) {
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/invitations`, 'GET')
      req.account = req.administrator = administrator.account
      req.session = req.administratorSession = administrator.session
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
      for (let i = 0, len = 10; i < len; i++) {
        await TestHelper.createInvitation(owner, owner.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/invitations`, 'GET')
      req.account = req.administrator = administrator.account
      req.session = req.administratorSession = administrator.session
      global.PAGE_SIZE = 8
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

    it('should enforce specified offset', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const invitations = []
      for (let i = 0, len = 10; i < len; i++) {
        const invitation = await TestHelper.createInvitation(owner, owner.organization.organizationid)
        invitations.unshift(invitation)
      }
      const offset = 3
      const req = TestHelper.createRequest(`/administrator/organizations/invitations?offset=${offset}`, 'GET')
      req.account = req.administrator = administrator.account
      req.session = req.administratorSession = administrator.session
      const res = TestHelper.createResponse()
      res.end = async (str) => {
        const doc = TestHelper.extractDoc(str)
        assert.notEqual(null, doc)
        for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
          assert.notEqual(null, doc.getElementById(invitations[offset + i].invitationid))
        }
      }
      return req.route.api.get(req, res)
    })
  })
})
