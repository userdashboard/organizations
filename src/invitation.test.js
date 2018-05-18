/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('./test-helper.js')

describe('internal-api/invitation', () => {
  describe('Invitation#create()', () => {
    it('should require organizationid', async () => {
      try {
        await global.organizations.Invitation.create()
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should not work for deleted users', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await global.dashboard.Account.scheduleDelete(user.account.accountid)
      try {
        const codeHash = global.dashboard.Hash.fixedSaltHash('this-is-a-invitation-' + new Date().getTime())
        await global.organizations.Invitation.create(user.organization.organizationid, codeHash)
      } catch (error) {
        assert.equal(error.message, 'invalid-account')
      }
    })

    it('should create an invitation', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const invitation = await global.organizations.Invitation.create(user.organization.organizationid, 'a-fake-invitation-hash')
      assert.notEqual(invitation, null)
    })

    it('should update the owner\'s last invitation created date', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const initialLastCreated = await global.dashboard.Account.getProperty(user.account.accountid, 'invitation _lastCreated')
      assert.equal(initialLastCreated, null)
      await global.organizations.Invitation.create(user.organization.organizationid, 'a-fake-invitation-hash')
      const lastCreated = await global.dashboard.Account.getProperty(user.account.accountid, 'invitation_lastCreated')
      assert.notEqual(lastCreated, null)
    })
  })

  describe('Invitation#delete', () => {
    it('should require an invitation', async () => {
      try {
        await global.organizations.Invitation.deleteInvitation()
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation')
      }
    })

    it('should require a valid invitation', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await global.organizations.Invitation.create(user.organization.organizationid, 'a-fake-invitation-hash')
      try {
        await global.organizations.Invitation.deleteInvitation('asdfasdfsadfasdfasdfasdfasdfasdfasdfasdf')
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation')
      }
    })

    it('should delete the invitation', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = global.dashboard.Hash.fixedSaltHash('this-is-a-invitation-' + new Date().getTime())
      const invitation = await global.organizations.Invitation.create(user.organization.organizationid, codeHash)
      await global.organizations.Invitation.deleteInvitation(invitation.invitationid)
      try {
        await global.organizations.Invitation.load(invitation.invitationid)
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation')
      }
    })

    it('should update the owner\'s last invitation deleted date', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const initialLastDeleted = await global.dashboard.Account.getProperty(owner.account.accountid, 'invitation_lastDeleted')
      assert.equal(initialLastDeleted, null)
      const codeHash = global.dashboard.Hash.fixedSaltHash('this-is-a-invitation-' + new Date().getTime())
      const invitation = await global.organizations.Invitation.create(owner.organization.organizationid, codeHash)
      await global.organizations.Invitation.deleteInvitation(invitation.invitationid)
      const lastDeleted = await global.dashboard.Account.getProperty(owner.account.accountid, 'invitation_lastDeleted')
      assert.notEqual(lastDeleted, null)
    })
  })

  describe('Invitation#list()', () => {
    it('should require accountid', async () => {
      try {
        await global.organizations.Invitation.list()
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should not work for deleted users', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await global.dashboard.Account.scheduleDelete(user.account.accountid)
      try {
        await global.organizations.Invitation.list(user.organization.organizationid)
      } catch (error) {
        assert.equal(error.message, 'invalid-account')
      }
    })

    it('should return created invitations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const invitations = [
        await global.organizations.Invitation.create(user.organization.organizationid, global.dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())),
        await global.organizations.Invitation.create(user.organization.organizationid, global.dashboard.Hash.fixedSaltHash('2-this-is-a-invitation-' + new Date().getTime())),
        await global.organizations.Invitation.create(user.organization.organizationid, global.dashboard.Hash.fixedSaltHash('3-this-is-a-invitation-' + new Date().getTime()))
      ]
      const listed = await global.organizations.Invitation.list(user.organization.organizationid)
      listed.reverse()
      assert.equal(invitations.length, listed.length)
      for (const i in invitations) {
        assert.equal(invitations[i].invitationid, listed[i].invitationid)
      }
    })
  })

  describe('Invitation#load()', () => {
    it('should require invitation', async () => {
      try {
        await global.organizations.Invitation.load()
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation')
      }
    })

    it('should not work for deleted users', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = global.dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await global.organizations.Invitation.create(user.organization.organizationid, codeHash)
      await global.dashboard.Account.scheduleDelete(user.account.accountid)
      try {
        await global.organizations.Invitation.load(invitation.invitationid)
      } catch (error) {
        assert.equal(error.message, 'invalid-account')
      }
    })

    it('should return the invitation', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = global.dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await global.organizations.Invitation.create(user.organization.organizationid, codeHash)
      const loaded = await global.organizations.Invitation.load(invitation.invitationid)
      assert.equal(invitation.invitationid, loaded.invitationid)
    })
  })

  describe('Invitation#loadMany()', () => {
    it('should require one or more invitationids', async () => {
      try {
        await global.organizations.Invitation.loadMany()
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation-code-array')
      }
    })

    it('should not work for deleted user', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = global.dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await global.organizations.Invitation.create(user.organization.organizationid, codeHash)
      await global.dashboard.Account.scheduleDelete(user.account.accountid)
      try {
        await global.organizations.Invitation.loadMany([invitation.invitationid])
      } catch (error) {
        assert.equal(error.message, 'invalid-account')
      }
    })

    it('should load the invitations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const invitations = [
        await global.organizations.Invitation.create(user.organization.organizationid, global.dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())),
        await global.organizations.Invitation.create(user.organization.organizationid, global.dashboard.Hash.fixedSaltHash('2-this-is-a-invitation-' + new Date().getTime())),
        await global.organizations.Invitation.create(user.organization.organizationid, global.dashboard.Hash.fixedSaltHash('3-this-is-a-invitation-' + new Date().getTime()))
      ]
      const invitationids = [
        invitations[0].invitationid,
        invitations[1].invitationid,
        invitations[2].invitationid
      ]
      const loaded = await global.organizations.Invitation.loadMany(invitationids)
      assert.equal(loaded.length, invitationids.length)
      for (const i in invitationids) {
        assert.equal(loaded[i].invitationid, invitationids[i])
      }
    })
  })

  describe('Invitation#accept()', () => {
    it('should require an organizationid', async () => {
      try {
        await global.organizations.Invitation.accept()
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should require an invitation code', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      try {
        await global.organizations.Invitation.accept(owner.account.accountid, null)
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation-code')
      }
    })

    it('should require a valid invitation code', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const codeHash = global.dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      await global.organizations.Invitation.create(owner.organization.organizationid, codeHash)
      const user = await TestHelper.createUser()
      try {
        await global.organizations.Invitation.accept(owner.organization.organizationid, 'bad invitation', user.account.accountid)
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation-code')
      }
    })

    it('should reject the owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const codeText = '1-this-is-a-invitation-' + new Date().getTime()
      const codeHash = global.dashboard.Hash.fixedSaltHash(codeText)
      await global.organizations.Invitation.create(owner.organization.organizationid, codeHash)
      try {
        await global.organizations.Invitation.accept(owner.organization.organizationid, codeText, owner.account.accountid)
      } catch (error) {
        assert.equal(error.message, 'invalid-account')
      }
    })

    it('should reject deleted account', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const codeText = '2-this-is-a-invitation-' + new Date().getTime()
      const codeHash = global.dashboard.Hash.fixedSaltHash(codeText)
      await global.organizations.Invitation.create(owner.organization.organizationid, codeHash)
      const user = await TestHelper.createUser()
      await global.dashboard.Account.scheduleDelete(user.account.accountid)
      try {
        await global.organizations.Invitation.accept(owner.organization.organizationid, codeText, user.account.accountid)
      } catch (error) {
        assert.equal(error.message, 'invalid-account')
      }
    })

    it('should reject existing member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const codeText = '3-this-is-a-invitation-' + new Date().getTime()
      const codeHash = global.dashboard.Hash.fixedSaltHash(codeText)
      const user = await TestHelper.createUser()
      await global.organizations.Invitation.create(owner.organization.organizationid, codeHash)
      await global.organizations.Invitation.accept(owner.organization.organizationid, codeText, user.account.accountid)
      try {
        await global.organizations.Invitation.accept(owner.organization.organizationid, codeText, user.account.accountid)
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation')
      }
    })

    it('should mark invitation as accepted', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const rawCode = 'this-is-a-invitation-' + new Date().getTime()
      const codeHash = global.dashboard.Hash.fixedSaltHash(rawCode)
      const user = await TestHelper.createUser()
      const invitation = await global.organizations.Invitation.create(owner.organization.organizationid, codeHash)
      await global.organizations.Invitation.accept(owner.organization.organizationid, rawCode, user.account.accountid)
      const invitationNow = await global.organizations.Invitation.load(invitation.invitationid)
      assert.equal(invitationNow.accepted, user.account.accountid)
    })

    it('should update the owner\'s last invitation accepted date', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const initialLastUsed = await global.dashboard.Account.getProperty(owner.account.accountid, 'invitation_lastAccepted')
      assert.equal(initialLastUsed, null)
      const rawCode = 'this-is-a-invitation-' + new Date().getTime()
      const codeHash = global.dashboard.Hash.fixedSaltHash(rawCode)
      const user = await TestHelper.createUser()
      await global.organizations.Invitation.create(owner.organization.organizationid, codeHash)
      await global.organizations.Invitation.accept(owner.organization.organizationid, rawCode, user.account.accountid)
      const lastUsed = await global.dashboard.Account.getProperty(owner.account.accountid, 'invitation_lastAccepted')
      assert.notEqual(lastUsed, null)
    })
  })

  describe('Invitation#setProperty', () => {
    it('should require an invitation', async () => {
      try {
        await global.organizations.Invitation.setProperty(null, 'property', 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation')
      }
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      try {
        await global.organizations.Invitation.setProperty(user.organization.organizationid, null, 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should require a value', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      try {
        await global.organizations.Invitation.setProperty(user.organization.organizationid, 'property', null)
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should set the property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await global.organizations.Invitation.setProperty(user.organization.organizationid, 'testProperty', 'test-value')
      const value = await global.organizations.Invitation.getProperty(user.organization.organizationid, 'testProperty')
      assert.equal(value, 'test-value')
    })
  })

  describe('Invitation#getProperty', () => {
    it('should require an invitation', async () => {
      try {
        await global.organizations.Invitation.getProperty(null, 'property')
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation')
      }
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = global.dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await global.organizations.Invitation.create(user.organization.organizationid, codeHash)
      try {
        await global.organizations.Invitation.getProperty(invitation.invitationid)
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should retrieve the property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = global.dashboard.Hash.fixedSaltHash('2-this-is-a-invitation-' + new Date().getTime())
      const invitation = await global.organizations.Invitation.create(user.organization.organizationid, codeHash)
      await global.organizations.Invitation.setProperty(invitation.invitationid, 'testProperty', 'test-value')
      const stringValue = await global.organizations.Invitation.getProperty(invitation.invitationid, 'testProperty')
      assert.equal(stringValue, 'test-value')
      await global.organizations.Invitation.setProperty(invitation.invitationid, 'testProperty', 1234)
      const invitationNow = await global.organizations.Invitation.load(invitation.invitationid)
      assert.strictEqual(invitationNow.testProperty, 1234)
    })
  })

  describe('Invitation#removeProperty', () => {
    it('should require an invitation', async () => {
      try {
        await global.organizations.Invitation.removeProperty(null, 'property')
      } catch (error) {
        assert.equal(error.message, 'invalid-invitation')
      }
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = global.dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await global.organizations.Invitation.create(user.organization.organizationid, codeHash)
      try {
        await global.organizations.Invitation.removeProperty(invitation.invitationid)
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should remove the property', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const codeHash = global.dashboard.Hash.fixedSaltHash('1-this-is-a-invitation-' + new Date().getTime())
      const invitation = await global.organizations.Invitation.create(user.organization.organizationid, codeHash)
      await global.organizations.Invitation.setProperty(invitation.invitationid, 'testProperty', 'test-value')
      await global.organizations.Invitation.removeProperty(invitation.invitationid, 'testProperty')
      const stringValue = await global.organizations.Invitation.getProperty(invitation.invitationid, 'testProperty')
      assert.equal(stringValue, null)
    })
  })
})
