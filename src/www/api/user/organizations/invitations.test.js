/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe(`/api/user/organizations/invitations`, () => {
  describe('Invitations#GET', () => {
    it('should return invitation list', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const invitation1 = await TestHelper.createInvitation(owner)
      const invitation2 = await TestHelper.createInvitation(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const invitations = await req.route.api.get(req)
      assert.equal(invitations.length, 2)
      assert.equal(invitations[0].invitationid, invitation2.invitationid)
      assert.equal(invitations[1].invitationid, invitation1.invitationid)
    })

    it('should enforce page size', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      for (let i = 0, len = 10; i < len; i++) {
        await TestHelper.createInvitation(owner)
      }
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      global.PAGE_SIZE = 8
      const codesNow = await req.route.api.get(req)
      assert.equal(codesNow.length, 8)
    })

    it('should enforce specified offset', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const invitations = []
      for (let i = 0, len = 10; i < len; i++) {
        const invitation = await TestHelper.createInvitation(owner)
        invitations.unshift(invitation)
      }
      const offset = 3
      const req = TestHelper.createRequest(`/api/user/organizations/invitations?accountid=${owner.account.accountid}&offset=${offset}`, 'GET')
      req.account = owner.account
      req.session = owner.session
      const invitationsNow = await req.route.api.get(req)
      for (let i = 0, len = global.PAGE_SIZE; i < len; i++) {
        assert.equal(invitationsNow[i].invitationid, invitations[offset + i].invitationid)
      }
    })
  })
})
