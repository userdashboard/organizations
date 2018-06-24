/* eslint-env mocha */
const assert = require('assert')
const dashboard = require('@userappstore/dashboard')
const orgs = require('../index.js')
const TestHelper = require('../test-helper.js')

describe('internal-api/invitation', () => {
  describe('Invitation#create()', () => {
    it('should require organizationid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.create()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should create an invitation', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const invitation = await orgs.Invitation.create(user.organization.organizationid, 'a-fake-invitation-hash')
      assert.notEqual(invitation, null)
    })
  })

  describe('Invitation#delete', () => {
    it('should require an invitationid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.deleteInvitation()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should require a valid invitationid', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await orgs.Invitation.create(user.organization.organizationid, 'a-fake-invitation-hash')
      let errorMessage
      try {
        await orgs.Invitation.deleteInvitation('asdfasdfsadfasdfasdfasdfasdfasdfasdfasdf')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should delete the invitation', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      await orgs.Invitation.deleteInvitation(owner.invitation.invitationid)
      let errorMessage
      try {
        await orgs.Invitation.load(owner.invitation.invitationid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })
  })

  describe('Invitation#load()', () => {
    it('should require invitationid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.load()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should return the invitation', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await orgs.Invitation.create(user.organization.organizationid, codeHash)
      const loaded = await orgs.Invitation.load(invitation.invitationid)
      assert.equal(invitation.invitationid, loaded.invitationid)
    })
  })

  describe('Invitation#loadMany()', () => {
    it('should require one or more invitationids', async () => {
      let errorMessage
      try {
        await orgs.Invitation.loadMany()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationids')
    })

    it('should load the invitations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const invitations = [
        await orgs.Invitation.create(user.organization.organizationid, dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())),
        await orgs.Invitation.create(user.organization.organizationid, dashboard.Hash.fixedSaltHash('2-this-is-a-invitation-' + new Date().getTime())),
        await orgs.Invitation.create(user.organization.organizationid, dashboard.Hash.fixedSaltHash('3-this-is-a-invitation-' + new Date().getTime()))
      ]
      const invitationids = [
        invitations[0].invitationid,
        invitations[1].invitationid,
        invitations[2].invitationid
      ]
      const loaded = await orgs.Invitation.loadMany(invitationids)
      assert.equal(loaded.length, invitationids.length)
      for (const i in invitationids) {
        assert.equal(loaded[i].invitationid, invitationids[i])
      }
    })
  })

  describe('Invitation#accept()', () => {
    it('should require an organizationid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.accept()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should require an invitation code', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      let errorMessage
      try {
        await orgs.Invitation.accept(owner.account.accountid, null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitation-code')
    })

    it('should require a valid invitation code', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const codeHash = dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      await orgs.Invitation.create(owner.organization.organizationid, codeHash)
      const user = await TestHelper.createUser()
      let errorMessage
      try {
        await orgs.Invitation.accept(owner.organization.organizationid, 'bad invitation', user.account.accountid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitation-code')
    })

    it('should reject the owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const codeText = '1-this-is-a-invitation-' + new Date().getTime()
      const codeHash = dashboard.Hash.fixedSaltHash(codeText)
      await orgs.Invitation.create(owner.organization.organizationid, codeHash)
      let errorMessage
      try {
        await orgs.Invitation.accept(owner.organization.organizationid, codeText, owner.account.accountid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-account')
    })

    it('should reject existing member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const codeText = '3-this-is-a-invitation-' + new Date().getTime()
      const codeHash = dashboard.Hash.fixedSaltHash(codeText)
      const user = await TestHelper.createUser()
      await orgs.Invitation.create(owner.organization.organizationid, codeHash)
      await orgs.Invitation.accept(owner.organization.organizationid, codeText, user.account.accountid)
      let errorMessage
      try {
        await orgs.Invitation.accept(owner.organization.organizationid, codeText, user.account.accountid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitation')
    })

    it('should mark invitation as accepted', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      await TestHelper.createInvitation(owner)
      const user = await TestHelper.createUser()
      const invitationNow = await orgs.Invitation.accept(owner.organization.organizationid, owner.invitation.code, user.account.accountid)
      assert.notEqual(null, invitationNow.accepted)
    })
  })
})
