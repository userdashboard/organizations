/* eslint-env mocha */
const assert = require('assert')
const dashboard = require('@userappstore/dashboard')
const Membership = require('./membership.js')
const TestHelper = require('./test-helper.js')

describe('internal-api/membership', async () => {
  describe('Membership#create()', () => {
    it('should require an organization', async () => {
      const organizationid = null
      const accountid = null
      let errorMessage
      try {
        await Membership.create(organizationid, accountid)
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
        await Membership.create(organizationid, accountid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-accountid')
    })

    it('should create membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await Membership.create(owner.organization.organizationid, user.account.accountid)
      assert.notEqual(null, membership)
    })

    it('should update the user\'s last membership created date', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await Membership.create(owner.organization.organizationid, user.account.accountid)
      const lastCreated = await dashboard.Account.getProperty(user.account.accountid, 'membership_lastCreated')
      assert.notEqual(lastCreated, null)
    })
  })

  describe('Membership#delete', () => {
    it('should require a valid membershipid', async () => {
      let errorMessage
      try {
        await Membership.deleteMembership()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })

    it('should delete membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await Membership.create(owner.organization.organizationid, user.account.accountid)
      await Membership.deleteMembership(membership.membershipid)
      let errorMessage
      try {
        await Membership.load(membership.membershipid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })
  })

  describe('Membership#setProperty', () => {
    it('should require a membershipid', async () => {
      let errorMessage
      try {
        await Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })

    it('should require a property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await Membership.create(owner.organization.organizationid, user.account.accountid)
      let errorMessage
      try {
        await Membership.getProperty(membership.membershipid, null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should require a value', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await Membership.create(owner.organization.organizationid, user.account.accountid)
      let errorMessage
      try {
        await Membership.setProperty(membership.membershipid, 'property', null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should set the property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await Membership.create(owner.organization.organizationid, user.account.accountid)
      await Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      const value = await Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(value, 'test-value')
    })
  })

  describe('Membership#getProperty', () => {
    it('should require a membershipid', async () => {
      let errorMessage
      try {
        await Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })

    it('should require a property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await Membership.create(owner.organization.organizationid, user.account.accountid)
      let errorMessage
      try {
        await Membership.getProperty(membership.membershipid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should retrieve the property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await Membership.create(owner.organization.organizationid, user.account.accountid)
      await Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      const stringValue = await Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(stringValue, 'test-value')
      await Membership.setProperty(membership.membershipid, 'testProperty', 1234)
      const membershipNow = await Membership.load(membership.membershipid)
      assert.strictEqual(membershipNow.testProperty, 1234)
    })
  })

  describe('Membership#removeProperty', () => {
    it('should require a membershipid', async () => {
      let errorMessage
      try {
        await Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-membershipid')
    })

    it('should require a property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await Membership.create(owner.organization.organizationid, user.account.accountid)
      let errorMessage
      try {
        await Membership.getProperty(membership.membershipid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should remove the property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await Membership.create(owner.organization.organizationid, user.account.accountid)
      await Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      await Membership.removeProperty(membership.membershipid, 'testProperty')
      const stringValue = await Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(stringValue, null)
    })
  })
})
