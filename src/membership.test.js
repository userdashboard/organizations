/* eslint-env mocha */
const assert = require('assert')
const dashboard = require('@userappstore/dashboard')
const orgs = require('../index.js')
const TestHelper = require('./test-helper.js')

describe('internal-api/membership', async () => {
  describe('Membership#count()', async () => {
    it('should require accountid', async () => {
      let errorMessage
      try {
        await orgs.Membership.count()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-accountid')
    })

    it('should return count of user\'s memberships', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await TestHelper.createMembership(user, user.organization.organizationid)
      await TestHelper.createMembership(user, user.organization.organizationid)
      await TestHelper.createMembership(user, user.organization.organizationid)
      const count = await orgs.Membership.count(user.account.accountid)
      assert.equal(count, 3)
    })
  })

  describe('Membership#countAll()', async () => {
    it('should return all memberships', async () => {
      const user1 = await TestHelper.createUser()
      await TestHelper.createOrganization(user1)
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2)
      await TestHelper.createMembership(user1, user1.organization.organizationid)
      await TestHelper.createMembership(user2, user2.organization.organizationid)
      const count = await orgs.Membership.countAll()
      assert.equal(count, 2)
    })
  })

  describe('Membership#countByOrganization()', async () => {
    it('should require organizationid', async () => {
      let errorMessage
      try {
        await orgs.Membership.countByOrganization()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should return all organization\'s memberships', async () => {
      const user1 = await TestHelper.createUser()
      await TestHelper.createOrganization(user1)
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2)
      await TestHelper.createMembership(user1, user1.organization.organizationid)
      await TestHelper.createMembership(user2, user2.organization.organizationid)
      const count = await orgs.Membership.countByOrganization(user1.organization.organizationid)
      assert.equal(count, 1)
    })
  })

  describe('Membership#create()', () => {
    it('should require an organization', async () => {
      const organizationid = null
      const accountid = null
      let errorMessage
      try {
        await orgs.Membership.create(organizationid, accountid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should require an accountid', async () => {
      const organizationid = '1'
      const accountid = null
      let errorMessage
      try {
        await orgs.Membership.create(organizationid, accountid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-accountid')
    })

    it('should create membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await orgs.Membership.create(owner.organization.organizationid, user.account.accountid)
      assert.notEqual(null, membership)
    })

    it('should update the user\'s last membership created date', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await orgs.Membership.create(owner.organization.organizationid, user.account.accountid)
      const lastCreated = await dashboard.Account.getProperty(user.account.accountid, 'membership_lastCreated')
      assert.notEqual(lastCreated, null)
    })
  })

  describe('Membership#delete', () => {
    it('should require a valid membershipid', async () => {
      let errorMessage
      try {
        await orgs.Membership.deleteMembership()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })

    it('should delete membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await orgs.Membership.create(owner.organization.organizationid, user.account.accountid)
      await orgs.Membership.deleteMembership(membership.membershipid)
      let errorMessage
      try {
        await orgs.Membership.load(membership.membershipid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })
  })

  describe('Membership#list()', () => {
    it('should require accountid', async () => {
      let errorMessage
      try {
        await orgs.Membership.list(null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-accountid')
    })

    it('should return all of owner\'s memberships', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await TestHelper.createMembership(user, user.organization.organizationid)
      await TestHelper.createOrganization(user)
      await TestHelper.createMembership(user, user.organization.organizationid)
      await TestHelper.createOrganization(user)
      await TestHelper.createMembership(user, user.organization.organizationid)
      const listed = await orgs.Membership.list(user.account.accountid)
      assert.equal(3, listed.length)
    })
  })

  describe('Membership#listAll()', () => {
    it('should return all memberships', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2)
      const user3 = await TestHelper.createUser()
      await TestHelper.createOrganization(user3)
      await TestHelper.createMembership(user, user.organization.organizationid)
      await TestHelper.createMembership(user2, user2.organization.organizationid)
      await TestHelper.createMembership(user2, user2.organization.organizationid)
      await TestHelper.createMembership(user3, user3.organization.organizationid)
      const listed = await orgs.Membership.listAll()
      assert.equal(4, listed.length)
    })

    it('should filter by accountid', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user1 = await TestHelper.createUser()
      const membership1 = await TestHelper.createMembership(user1, owner.organization.organizationid)
      const membership2 = await TestHelper.createMembership(user1, owner.organization.organizationid)
      const owner2 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner2)
      await TestHelper.createMembership(await TestHelper.createUser(), owner2.organization.organizationid)
      await TestHelper.createMembership(await TestHelper.createUser(), owner2.organization.organizationid)
      const owner3 = await TestHelper.createUser()
      await TestHelper.createOrganization(owner3)
      await TestHelper.createMembership(await TestHelper.createUser(), owner3.organization.organizationid)
      await TestHelper.createMembership(await TestHelper.createUser(), owner3.organization.organizationid)
      const listed = await orgs.Membership.listAll(user1.account.accountid)
      assert.equal(listed.length, 2)
      assert.equal(listed[0].membershipid, membership2.membershipid)
      assert.equal(listed[1].membershipid, membership1.membershipid)
    })
  })

  describe('Membership#listByOrganization()', () => {
    it('should require organizationid', async () => {
      let errorMessage
      try {
        await orgs.Membership.listByOrganization(null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should return organization\'s memberships', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user1 = await TestHelper.createUser()
      await TestHelper.createMembership(user1, owner.organization.organizationid)
      const user2 = await TestHelper.createUser()
      await TestHelper.createMembership(user2, owner.organization.organizationid)
      const user3 = await TestHelper.createUser()
      await TestHelper.createMembership(user3, owner.organization.organizationid)
      const user4 = await TestHelper.createUser()
      await TestHelper.createMembership(user4, owner.organization.organizationid)
      const listed = await orgs.Membership.listByOrganization(owner.organization.organizationid)
      assert.equal(4, listed.length)
    })
  })

  describe('Membership#setProperty', () => {
    it('should require a membershipid', async () => {
      let errorMessage
      try {
        await orgs.Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })

    it('should require a property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await orgs.Membership.create(owner.organization.organizationid, user.account.accountid)
      let errorMessage
      try {
        await orgs.Membership.getProperty(membership.membershipid, null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should require a value', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await orgs.Membership.create(owner.organization.organizationid, user.account.accountid)
      let errorMessage
      try {
        await orgs.Membership.setProperty(membership.membershipid, 'property', null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should set the property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await orgs.Membership.create(owner.organization.organizationid, user.account.accountid)
      await orgs.Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      const value = await orgs.Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(value, 'test-value')
    })
  })

  describe('Membership#getProperty', () => {
    it('should require a membershipid', async () => {
      let errorMessage
      try {
        await orgs.Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })

    it('should require a property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await orgs.Membership.create(owner.organization.organizationid, user.account.accountid)
      let errorMessage
      try {
        await orgs.Membership.getProperty(membership.membershipid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should retrieve the property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await orgs.Membership.create(owner.organization.organizationid, user.account.accountid)
      await orgs.Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      const stringValue = await orgs.Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(stringValue, 'test-value')
      await orgs.Membership.setProperty(membership.membershipid, 'testProperty', 1234)
      const membershipNow = await orgs.Membership.load(membership.membershipid)
      assert.strictEqual(membershipNow.testProperty, 1234)
    })
  })

  describe('Membership#removeProperty', () => {
    it('should require a membershipid', async () => {
      let errorMessage
      try {
        await orgs.Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })

    it('should require a property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await orgs.Membership.create(owner.organization.organizationid, user.account.accountid)
      let errorMessage
      try {
        await orgs.Membership.getProperty(membership.membershipid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should remove the property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await orgs.Membership.create(owner.organization.organizationid, user.account.accountid)
      await orgs.Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      await orgs.Membership.removeProperty(membership.membershipid, 'testProperty')
      const stringValue = await orgs.Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(stringValue, null)
    })
  })
})
