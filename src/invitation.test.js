/* eslint-env mocha */
const assert = require('assert')
const dashboard = require('@userappstore/dashboard')
const orgs = require('../index.js')
const TestHelper = require('./test-helper.js')

describe('internal-api/invitation', () => {
  describe('Invitation#count()', async () => {
    it('should require accountid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.count()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-accountid')
    })

    it('should return count of user\'s invitations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await TestHelper.createInvitation(user, user.organization.organizationid)
      await TestHelper.createInvitation(user, user.organization.organizationid)
      await TestHelper.createInvitation(user, user.organization.organizationid)
      const count = await orgs.Invitation.count(user.account.accountid)
      assert.equal(count, 3)
    })
  })

  describe('Invitation#countAll()', async () => {
    it('should return all invitations', async () => {
      const user1 = await TestHelper.createUser()
      await TestHelper.createOrganization(user1)
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2)
      await TestHelper.createInvitation(user1, user1.organization.organizationid)
      await TestHelper.createInvitation(user2, user2.organization.organizationid)
      const count = await orgs.Invitation.countAll()
      assert.equal(count, 2)
    })
  })

  describe('Invitation#countByOrganization()', async () => {
    it('should require organizationid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.countByOrganization()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should return all organization\'s invitations', async () => {
      const user1 = await TestHelper.createUser()
      await TestHelper.createOrganization(user1)
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2)
      await TestHelper.createInvitation(user1, user1.organization.organizationid)
      await TestHelper.createInvitation(user2, user2.organization.organizationid)
      const count = await orgs.Invitation.countByOrganization(user1.organization.organizationid)
      assert.equal(count, 1)
    })
  })

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

    it('should update the owner\'s last invitation created date', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const initialLastCreated = await dashboard.Account.getProperty(user.account.accountid, 'invitation _lastCreated')
      assert.equal(initialLastCreated, null)
      await orgs.Invitation.create(user.organization.organizationid, 'a-fake-invitation-hash')
      const lastCreated = await dashboard.Account.getProperty(user.account.accountid, 'invitation_lastCreated')
      assert.notEqual(lastCreated, null)
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
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('this-is-a-invitation-' + new Date().getTime())
      const invitation = await orgs.Invitation.create(user.organization.organizationid, codeHash)
      await orgs.Invitation.deleteInvitation(invitation.invitationid)
      let errorMessage
      try {
        await orgs.Invitation.load(invitation.invitationid)
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
      const invitation = await orgs.Invitation.create(owner.organization.organizationid, codeHash)
      await orgs.Invitation.deleteInvitation(invitation.invitationid)
      const lastDeleted = await dashboard.Account.getProperty(owner.account.accountid, 'invitation_lastDeleted')
      assert.notEqual(lastDeleted, null)
    })
  })

  describe('Invitation#list()', () => {
    it('should require accountid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.list(null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-accountid')
    })

    it('should return created invitations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await TestHelper.createInvitation(user, user.organization.organizationid)
      await TestHelper.createOrganization(user)
      await TestHelper.createInvitation(user, user.organization.organizationid)
      await TestHelper.createOrganization(user)
      await TestHelper.createInvitation(user, user.organization.organizationid)
      const listed = await orgs.Invitation.list(user.account.accountid)
      assert.equal(3, listed.length)
    })
  })

  describe('Invitation#listAll()', () => {
    it('should return all invitations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2)
      await TestHelper.createInvitation(user, user.organization.organizationid)
      await TestHelper.createInvitation(user2, user2.organization.organizationid)
      await TestHelper.createInvitation(user2, user2.organization.organizationid)
      const listed = await orgs.Invitation.listAll()
      assert.equal(3, listed.length)
    })
  })

  describe('Invitation#listByOrganization()', () => {
    it('should require organizationid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.listByOrganization(null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should return organization\'s invitations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await TestHelper.createInvitation(user, user.organization.organizationid)
      await TestHelper.createInvitation(user, user.organization.organizationid)
      const listed = await orgs.Invitation.listByOrganization(user.organization.organizationid)
      assert.equal(2, listed.length)
    })
  })

  describe('Invitation#listAllByOrganization()', () => {
    it('should return all invitations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await TestHelper.createInvitation(user, user.organization.organizationid)
      const user2 = await TestHelper.createUser()
      await TestHelper.transferOrganization(user2, user.organization.organizationid)
      await TestHelper.createInvitation(user2, user.organization.organizationid)
      const listed = await orgs.Invitation.listAllByOrganization(user2.organization.organizationid)
      assert.equal(2, listed.length)
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
      const rawCode = 'this-is-a-invitation-' + new Date().getTime()
      const codeHash = dashboard.Hash.fixedSaltHash(rawCode)
      const user = await TestHelper.createUser()
      const invitation = await orgs.Invitation.create(owner.organization.organizationid, codeHash)
      await orgs.Invitation.accept(owner.organization.organizationid, rawCode, user.account.accountid)
      const invitationNow = await orgs.Invitation.load(invitation.invitationid)
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
      await orgs.Invitation.create(owner.organization.organizationid, codeHash)
      await orgs.Invitation.accept(owner.organization.organizationid, rawCode, user.account.accountid)
      const lastUsed = await dashboard.Account.getProperty(owner.account.accountid, 'invitation_lastAccepted')
      assert.notEqual(lastUsed, null)
    })
  })

  describe('Invitation#setProperty', () => {
    it('should require an invitationid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.setProperty(null, 'property', 'value')
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
        await orgs.Invitation.setProperty(user.organization.organizationid, null, 'value')
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
        await orgs.Invitation.setProperty(user.organization.organizationid, 'property', null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should set the property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await orgs.Invitation.setProperty(user.organization.organizationid, 'testProperty', 'test-value')
      const value = await orgs.Invitation.getProperty(user.organization.organizationid, 'testProperty')
      assert.equal(value, 'test-value')
    })
  })

  describe('Invitation#getProperty', () => {
    it('should require an invitationid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.getProperty(null, 'propertyid')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await orgs.Invitation.create(user.organization.organizationid, codeHash)
      let errorMessage
      try {
        await orgs.Invitation.getProperty(invitation.invitationid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should retrieve the property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('2-this-is-a-invitation-' + new Date().getTime())
      const invitation = await orgs.Invitation.create(user.organization.organizationid, codeHash)
      await orgs.Invitation.setProperty(invitation.invitationid, 'testProperty', 'test-value')
      const stringValue = await orgs.Invitation.getProperty(invitation.invitationid, 'testProperty')
      assert.equal(stringValue, 'test-value')
      await orgs.Invitation.setProperty(invitation.invitationid, 'testProperty', 1234)
      const invitationNow = await orgs.Invitation.load(invitation.invitationid)
      assert.strictEqual(invitationNow.testProperty, 1234)
    })
  })

  describe('Invitation#removeProperty', () => {
    it('should require an invitationid', async () => {
      let errorMessage
      try {
        await orgs.Invitation.removeProperty(null, 'property')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-invitationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await orgs.Invitation.create(user.organization.organizationid, codeHash)
      let errorMessage
      try {
        await orgs.Invitation.removeProperty(invitation.invitationid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should remove the property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await orgs.Invitation.create(user.organization.organizationid, codeHash)
      await orgs.Invitation.setProperty(invitation.invitationid, 'testProperty', 'test-value')
      await orgs.Invitation.removeProperty(invitation.invitationid, 'testProperty')
      const stringValue = await orgs.Invitation.getProperty(invitation.invitationid, 'testProperty')
      assert.equal(stringValue, null)
    })
  })
})
