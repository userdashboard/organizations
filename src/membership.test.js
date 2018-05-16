/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('./test-helper.js')

describe('internal-api/membership', async () => {
  describe('Membership#create()', () => {
    it('should require an organization', async () => {
      const organizationid = null
      const accountid = null
      try {
        await global.dashboard.organizations.Membership.create(organizationid, accountid)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should require an accountid', async () => {
      const organizationid = '1'
      const accountid = null
      try {
        await global.dashboard.organizations.Membership.create(organizationid, accountid)
      } catch (error) {
        assert.equal(error.message, 'invalid-account')
      }
    })

    it('should create membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await global.dashboard.organizations.Membership.create(owner.organization.organizationid, user.account.accountid)
      assert.notEqual(null, membership)
    })

    it('should update the user\'s last membership created date', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await global.dashboard.organizations.Membership.create(owner.organization.organizationid, user.account.accountid)
      const lastCreated = await global.dashboard.Account.getProperty(user.account.accountid, 'membership_lastCreated')
      assert.notEqual(lastCreated, null)
    })
  })

  describe('Membership#delete', () => {
    it('should require a valid membership', async () => {
      try {
        await global.dashboard.organizations.Membership.deleteMembership()
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should delete membership', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await global.dashboard.organizations.Membership.create(owner.organization.organizationid, user.account.accountid)
      await global.dashboard.organizations.Membership.deleteMembership(membership.membershipid)
      try {
        await global.dashboard.organizations.Membership.load(membership.membershipid)
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })
  })

  describe('Membership#setProperty', () => {
    it('should require a membershipid', async () => {
      try {
        await global.dashboard.organizations.Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should require a property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await global.dashboard.organizations.Membership.create(owner.organization.organizationid, user.account.accountid)
      try {
        await global.dashboard.organizations.Membership.getProperty(membership.membershipid, null, 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should require a value', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await global.dashboard.organizations.Membership.create(owner.organization.organizationid, user.account.accountid)
      try {
        await global.dashboard.organizations.Membership.getProperty(membership.membershipid, 'property', null)
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should set the property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await global.dashboard.organizations.Membership.create(owner.organization.organizationid, user.account.accountid)
      await global.dashboard.organizations.Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      const value = await global.dashboard.organizations.Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(value, 'test-value')
    })
  })

  describe('Membership#getProperty', () => {
    it('should require a membershipid', async () => {
      try {
        await global.dashboard.organizations.Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should require a property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await global.dashboard.organizations.Membership.create(owner.organization.organizationid, user.account.accountid)
      try {
        await global.dashboard.organizations.Membership.getProperty(membership.membershipid, null, 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should retrieve the property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await global.dashboard.organizations.Membership.create(owner.organization.organizationid, user.account.accountid)
      await global.dashboard.organizations.Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      const stringValue = await global.dashboard.organizations.Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(stringValue, 'test-value')
      await global.dashboard.organizations.Membership.setProperty(membership.membershipid, 'testProperty', 1234)
      const membershipNow = await global.dashboard.organizations.Membership.load(membership.membershipid)
      assert.strictEqual(membershipNow.testProperty, 1234)
    })
  })

  describe('Membership#removeProperty', () => {
    it('should require a membershipid', async () => {
      try {
        await global.dashboard.organizations.Membership.getProperty(null, 'property', 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-membership')
      }
    })

    it('should require a property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await global.dashboard.organizations.Membership.create(owner.organization.organizationid, user.account.accountid)
      try {
        await global.dashboard.organizations.Membership.getProperty(membership.membershipid, null, 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should remove the property', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const membership = await global.dashboard.organizations.Membership.create(owner.organization.organizationid, user.account.accountid)
      await global.dashboard.organizations.Membership.setProperty(membership.membershipid, 'testProperty', 'test-value')
      await global.dashboard.organizations.Membership.removeProperty(membership.membershipid, 'testProperty')
      const stringValue = await global.dashboard.organizations.Membership.getProperty(membership.membershipid, 'testProperty')
      assert.equal(stringValue, null)
    })
  })
})
