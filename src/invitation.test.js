/* eslint-env mocha */
const assert = require('assert')
const dashboard = require('@userappstore/dashboard')
const Invitation = require('./invitation.js')
const TestHelper = require('./test-helper.js')

describe('internal-api/invitation', () => {
  describe('Invitation#create()', () => {
    it('should require organizationid', async () => {
      let errorMessage
      try {
        await Invitation.create()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should create an invitation', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const invitation = await Invitation.create(user.organization.organizationid, 'a-fake-invitation-hash')
      assert.notEqual(invitation, null)
    })

    it('should update the owner\'s last invitation created date', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const initialLastCreated = await dashboard.Account.getProperty(user.account.accountid, 'invitation _lastCreated')
      assert.equal(initialLastCreated, null)
      await Invitation.create(user.organization.organizationid, 'a-fake-invitation-hash')
      const lastCreated = await dashboard.Account.getProperty(user.account.accountid, 'invitation_lastCreated')
      assert.notEqual(lastCreated, null)
    })
  })

  describe('Invitation#delete', () => {
    it('should require an invitationid', async () => {
      let errorMessage
      try {
        await Invitation.deleteInvitation()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should require a valid invitationid', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await Invitation.create(user.organization.organizationid, 'a-fake-invitation-hash')
      let errorMessage
      try {
        await Invitation.deleteInvitation('asdfasdfsadfasdfasdfasdfasdfasdfasdfasdf')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should delete the invitation', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('this-is-a-invitation-' + new Date().getTime())
      const invitation = await Invitation.create(user.organization.organizationid, codeHash)
      await Invitation.deleteInvitation(invitation.invitationid)
      let errorMessage
      try {
        await Invitation.load(invitation.invitationid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should update the owner\'s last invitation deleted date', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const initialLastDeleted = await dashboard.Account.getProperty(owner.account.accountid, 'invitation_lastDeleted')
      assert.equal(initialLastDeleted, null)
      const codeHash = dashboard.Hash.fixedSaltHash('this-is-a-invitation-' + new Date().getTime())
      const invitation = await Invitation.create(owner.organization.organizationid, codeHash)
      await Invitation.deleteInvitation(invitation.invitationid)
      const lastDeleted = await dashboard.Account.getProperty(owner.account.accountid, 'invitation_lastDeleted')
      assert.notEqual(lastDeleted, null)
    })
  })

  describe('Invitation#list()', () => {
    it('should require organizationid', async () => {
      let errorMessage
      try {
        await Invitation.list(null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should return created invitations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const invitations = [
        await Invitation.create(user.organization.organizationid, dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())),
        await Invitation.create(user.organization.organizationid, dashboard.Hash.fixedSaltHash('2-this-is-a-invitation-' + new Date().getTime())),
        await Invitation.create(user.organization.organizationid, dashboard.Hash.fixedSaltHash('3-this-is-a-invitation-' + new Date().getTime()))
      ]
      const listed = await Invitation.list(user.organization.organizationid)
      listed.reverse()
      assert.equal(invitations.length, listed.length)
      for (const i in invitations) {
        assert.equal(invitations[i].invitationid, listed[i].invitationid)
      }
    })
  })

  describe('Invitation#load()', () => {
    it('should require invitationid', async () => {
      let errorMessage
      try {
        await Invitation.load()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should return the invitation', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await Invitation.create(user.organization.organizationid, codeHash)
      const loaded = await Invitation.load(invitation.invitationid)
      assert.equal(invitation.invitationid, loaded.invitationid)
    })
  })

  describe('Invitation#loadMany()', () => {
    it('should require one or more invitationids', async () => {
      let errorMessage
      try {
        await Invitation.loadMany()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationids')
    })

    it('should load the invitations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const invitations = [
        await Invitation.create(user.organization.organizationid, dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())),
        await Invitation.create(user.organization.organizationid, dashboard.Hash.fixedSaltHash('2-this-is-a-invitation-' + new Date().getTime())),
        await Invitation.create(user.organization.organizationid, dashboard.Hash.fixedSaltHash('3-this-is-a-invitation-' + new Date().getTime()))
      ]
      const invitationids = [
        invitations[0].invitationid,
        invitations[1].invitationid,
        invitations[2].invitationid
      ]
      const loaded = await Invitation.loadMany(invitationids)
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
        await Invitation.accept()
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
        await Invitation.accept(owner.account.accountid, null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitation-code')
    })

    it('should require a valid invitation code', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const codeHash = dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      await Invitation.create(owner.organization.organizationid, codeHash)
      const user = await TestHelper.createUser()
      let errorMessage
      try {
        await Invitation.accept(owner.organization.organizationid, 'bad invitation', user.account.accountid)
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
      await Invitation.create(owner.organization.organizationid, codeHash)
      let errorMessage
      try {
        await Invitation.accept(owner.organization.organizationid, codeText, owner.account.accountid)
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
      await Invitation.create(owner.organization.organizationid, codeHash)
      await Invitation.accept(owner.organization.organizationid, codeText, user.account.accountid)
      let errorMessage
      try {
        await Invitation.accept(owner.organization.organizationid, codeText, user.account.accountid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitation')
    })

    it('should mark invitation as accepted', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const rawCode = 'this-is-a-invitation-' + new Date().getTime()
      const codeHash = dashboard.Hash.fixedSaltHash(rawCode)
      const user = await TestHelper.createUser()
      const invitation = await Invitation.create(owner.organization.organizationid, codeHash)
      await Invitation.accept(owner.organization.organizationid, rawCode, user.account.accountid)
      const invitationNow = await Invitation.load(invitation.invitationid)
      assert.equal(invitationNow.accepted, user.account.accountid)
    })

    it('should update the owner\'s last invitation accepted date', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const initialLastUsed = await dashboard.Account.getProperty(owner.account.accountid, 'invitation_lastAccepted')
      assert.equal(initialLastUsed, null)
      const rawCode = 'this-is-a-invitation-' + new Date().getTime()
      const codeHash = dashboard.Hash.fixedSaltHash(rawCode)
      const user = await TestHelper.createUser()
      await Invitation.create(owner.organization.organizationid, codeHash)
      await Invitation.accept(owner.organization.organizationid, rawCode, user.account.accountid)
      const lastUsed = await dashboard.Account.getProperty(owner.account.accountid, 'invitation_lastAccepted')
      assert.notEqual(lastUsed, null)
    })
  })

  describe('Invitation#setProperty', () => {
    it('should require an invitationid', async () => {
      let errorMessage
      try {
        await Invitation.setProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      let errorMessage
      try {
        await Invitation.setProperty(user.organization.organizationid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should require a value', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      let errorMessage
      try {
        await Invitation.setProperty(user.organization.organizationid, 'property', null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should set the property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await Invitation.setProperty(user.organization.organizationid, 'testProperty', 'test-value')
      const value = await Invitation.getProperty(user.organization.organizationid, 'testProperty')
      assert.equal(value, 'test-value')
    })
  })

  describe('Invitation#getProperty', () => {
    it('should require an invitationid', async () => {
      let errorMessage
      try {
        await Invitation.getProperty(null, 'propertyid')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await Invitation.create(user.organization.organizationid, codeHash)
      let errorMessage
      try {
        await Invitation.getProperty(invitation.invitationid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should retrieve the property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('2-this-is-a-invitation-' + new Date().getTime())
      const invitation = await Invitation.create(user.organization.organizationid, codeHash)
      await Invitation.setProperty(invitation.invitationid, 'testProperty', 'test-value')
      const stringValue = await Invitation.getProperty(invitation.invitationid, 'testProperty')
      assert.equal(stringValue, 'test-value')
      await Invitation.setProperty(invitation.invitationid, 'testProperty', 1234)
      const invitationNow = await Invitation.load(invitation.invitationid)
      assert.strictEqual(invitationNow.testProperty, 1234)
    })
  })

  describe('Invitation#removeProperty', () => {
    it('should require an invitationid', async () => {
      let errorMessage
      try {
        await Invitation.removeProperty(null, 'property')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await Invitation.create(user.organization.organizationid, codeHash)
      let errorMessage
      try {
        await Invitation.removeProperty(invitation.invitationid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should remove the property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await Invitation.create(user.organization.organizationid, codeHash)
      await Invitation.setProperty(invitation.invitationid, 'testProperty', 'test-value')
      await Invitation.removeProperty(invitation.invitationid, 'testProperty')
      const stringValue = await Invitation.getProperty(invitation.invitationid, 'testProperty')
      assert.equal(stringValue, null)
    })
  })
})
