/* eslint-env mocha */
const API = require('../index.js')
const assert = require('assert')
const dashboard = require('@userappstore/dashboard')
const TestHelper = require('./test-helper.js')

describe('internal-api/membership', async () => {
  describe('Membership#create()', () => {
    it('should require an organization', async () => {
      const organizationid = null
      const accountid = null
      try {
        await API.Membership.create(organizationid, accountid)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should require an accountid', async () => {
      const organizationid = '1'
      const accountid = null
      try {
        await API.Membership.create(organizationid, accountid)
      } catch (error) {
        assert.equal(error.message, 'invalid-account')
      }
    })

    it('should create membership', async () => {
      const owner = await TestHelper.createUser()
      const user = await TestHelper.createUser()
      const organization = await API.Organization.create(owner.account.accountid, 'org-name')
      const membership = await API.Membership.create(organization.organizationid, user.account.accountid)
      assert.notEqual(null, membership)
    })

    it('should update the user\'s last membership created date', async () => {
      const user = await TestHelper.createUser()
      const organization = await API.Organization.create(user.account.accountid, 'org-name')
      const otherUser = await TestHelper.createUser()
      const membership = await API.Membership.create(organization.organizationid, otherUser.account.accountid)
      assert.notEqual(null, membership)
      const lastCreated = await dashboard.Account.getProperty(otherUser.account.accountid, 'membership_lastCreated')
      assert.notEqual(lastCreated, null)
    })
  })

  describe('Membership#deleteMembership', () => {
    it('should require a valid membership', async () => {
      try {
        await API.Membership.deleteMembership()
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should delete membership', async () => {
      const user = await TestHelper.createUser()
      const otherUser = await TestHelper.createUser()
      const organization = await API.Organization.create(user.account.accountid, 'org-name')
      const membership = await API.Membership.create(organization.organizationid, otherUser.account.accountid)
      await API.Membership.deleteMembership(membership.membershipid)
      try {
        await API.Membership.load(membership.membershipid)
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })
  })

  describe('Membership#setProperty', () => {
    it('should require a membershipid', async () => {
      try {
        await API.Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      const otherUser = await TestHelper.createUser()
      const organization = await API.Organization.create(user.account.accountid, 'org-name')
      const membership = await API.Membership.create(organization.organizationid, otherUser.account.accountid)
      try {
        await API.Membership.getProperty(membership.membershipid, null, 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should require a value', async () => {
      const user = await TestHelper.createUser()
      const otherUser = await TestHelper.createUser()
      const organization = await API.Organization.create(user.account.accountid, 'org-name')
      const membership = await API.Membership.create(organization.organizationid, otherUser.account.accountid)
      try {
        await API.Membership.getProperty(membership.membershipid, 'property', null)
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should set the property', async () => {
      const user = await TestHelper.createUser()
      const otherUser = await TestHelper.createUser()
      const organization = await API.Organization.create(user.account.accountid, 'org-name')
      const membership = await API.Membership.create(organization.organizationid, otherUser.account.accountid)
      await API.Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      const value = await API.Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(value, 'test-value')
    })
  })

  describe('Membership#getProperty', () => {
    it('should require a membershipid', async () => {
      try {
        await API.Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      const otherUser = await TestHelper.createUser()
      const organization = await API.Organization.create(user.account.accountid, 'org-name')
      const membership = await API.Membership.create(organization.organizationid, otherUser.account.accountid)
      try {
        await API.Membership.getProperty(membership.membershipid, null, 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should retrieve the property', async () => {
      const user = await TestHelper.createUser()
      const otherUser = await TestHelper.createUser()
      const organization = await API.Organization.create(user.account.accountid, 'org-name')
      const membership = await API.Membership.create(organization.organizationid, otherUser.account.accountid)
      await API.Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      const stringValue = await API.Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(stringValue, 'test-value')
      await API.Membership.setProperty(membership.membershipid, 'testProperty', 1234)
      const membershipNow = await API.Membership.load(membership.membershipid)
      assert.strictEqual(membershipNow.testProperty, 1234)
    })
  })

  describe('Membership#removeProperty', () => {
    it('should require a membershipid', async () => {
      try {
        await API.Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      const otherUser = await TestHelper.createUser()
      const organization = await API.Organization.create(user.account.accountid, 'org-name')
      const membership = await API.Membership.create(organization.organizationid, otherUser.account.accountid)
      try {
        await API.Membership.getProperty(membership.membershipid, null, 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should remove the property', async () => {
      const user = await TestHelper.createUser()
      const otherUser = await TestHelper.createUser()
      const organization = await API.Organization.create(user.account.accountid, 'org-name')
      const membership = await API.Membership.create(organization.organizationid, otherUser.account.accountid)
      await API.Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      await API.Membership.removeProperty(membership.membershipid, 'testProperty')
      const stringValue = await API.Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(stringValue, null)
    })
  })
})
