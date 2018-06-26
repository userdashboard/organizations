/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/administrator/organizations/invitations`, () => {
  describe('Invitations#GET', () => {
    it('should limit invitation list to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const invitations = []
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        await TestHelper.createInvitation(owner)
        invitations.unshift(owner.invitation)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitations`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const invitationsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(invitationsNow[i].invitationid, invitations[i].invitationid)
      }
    })

    it('should enforce page size', async () => {
      global.PAGE_SIZE = 3
      const administrator = await TestHelper.createAdministrator()
      for (let i = 0, len = global.PAGE_SIZE + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createOrganization(user)
        await TestHelper.createInvitation(user, user.organization.organizationid)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/invitations', 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const invitationsNow = await req.route.api.get(req)
      assert.equal(invitationsNow.length, global.PAGE_SIZE)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const invitations = [ ]
      for (let i = 0, len = global.PAGE_SIZE + offset + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        await TestHelper.createOrganization(user)
        await TestHelper.createInvitation(user, user.organization.organizationid)
        invitations.unshift(user.invitation)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/invitations?offset=${offset}`, 'GET')
      req.administratorAccount = req.account = administrator.account
      req.administratorSession = req.session = administrator.session
      const invitationsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(invitationsNow[i].invitationid, invitations[offset + i].invitationid)
      }
    })
  })
})
