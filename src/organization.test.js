/* eslint-env mocha */
const assert = require('assert')
const dashboard = require('@userappstore/dashboard')
const orgs = require('../index.js')
const TestHelper = require('./test-helper.js')

describe('internal-api/organization', async () => {
  describe('Organization#count()', async () => {
    it('should require accountid', async () => {
      let errorMessage
      try {
        await orgs.Organization.count()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-accountid')
    })

    it('should return count of user\'s organizations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await TestHelper.createOrganization(user)
      const count = await orgs.Organization.count(user.account.accountid)
      assert.equal(count, 2)
    })
  })

  describe('Organization#countAll()', async () => {
    it('should return all organizations', async () => {
      const user1 = await TestHelper.createUser()
      await TestHelper.createOrganization(user1)
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2)
      await TestHelper.createMembership(user1, user1.organization.organizationid)
      await TestHelper.createMembership(user2, user2.organization.organizationid)
      const count = await orgs.Organization.countAll()
      assert.equal(count, 2)
    })
  })

  describe('Organization#create()', () => {
    it('should require organization name', async () => {
      const user = await TestHelper.createUser()
      const name = null
      let errorMessage
      try {
        await orgs.Organization.create(user.account.accountid, name)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization-name')
    })

    it('should force organization name length', async () => {
      const user = await TestHelper.createUser()
      const name = '12345'
      let errorMessage
      try {
        global.MINIMUM_ORGANIZATION_NAME_LENGTH = 100
        await orgs.Organization.create(user.account.accountid, name)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization-name-length')
      errorMessage = null
      try {
        global.MAXIMUM_ORGANIZATION_NAME_LENGTH = 1
        await orgs.Organization.create(user.account.accountid, name)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization-name-length')
    })

    it('should create an organization', async () => {
      const user = await TestHelper.createUser()
      const organization = await orgs.Organization.create(user.account.accountid, 'org-name')
      assert.notEqual(organization, null)
    })

    it('should update the user\'s last organization created date', async () => {
      const user = await TestHelper.createUser()
      const initialLastCreated = await dashboard.Account.getProperty(user.account.accountid, 'organization _lastCreated')
      assert.equal(initialLastCreated, null)
      await orgs.Organization.create(user.account.accountid, 'org2-name')
      const lastCreated = await dashboard.Account.getProperty(user.account.accountid, 'organization_lastCreated')
      assert.notEqual(lastCreated, null)
    })
  })

  describe('Organization#delete', () => {
    it('should require a valid organizationid', async () => {
      let errorMessage
      try {
        await orgs.Organization.deleteOrganization()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should delete organization', async () => {
      const user = await TestHelper.createUser()
      const organization = await orgs.Organization.create(user.account.accountid, 'organization-name')
      await orgs.Organization.deleteOrganization(organization.organizationid)
      let errorMessage
      try {
        await orgs.Organization.load(organization.organizationid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })
  })

  describe('Organization#list()', () => {
    it('should require accountid', async () => {
      let errorMessage
      try {
        await orgs.Organization.list(null)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-accountid')
    })

    it('should return all of owner\'s organizations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      await TestHelper.createOrganization(user)
      const listed = await orgs.Organization.list(user.account.accountid)
      assert.equal(2, listed.length)
    })
  })

  describe('Organization#listAll()', () => {
    it('should return all organizations', async () => {
      const user = await TestHelper.createUser()
      await TestHelper.createOrganization(user)
      const user2 = await TestHelper.createUser()
      await TestHelper.createOrganization(user2)
      const user3 = await TestHelper.createUser()
      await TestHelper.createOrganization(user3)
      const listed = await orgs.Organization.listAll()
      assert.equal(3, listed.length)
    })
  })

  describe('Organization#setProperty', () => {
    it('should require an organizationid', async () => {
      let errorMessage
      try {
        await orgs.Organization.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      let errorMessage
      try {
        await orgs.Organization.getProperty(user.account.accountid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should require a value', async () => {
      const user = await TestHelper.createUser()
      let errorMessage
      try {
        await orgs.Organization.setProperty(user.account.accountid, 'property')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-value')
    })

    it('should set the property', async () => {
      const user = await TestHelper.createUser()
      await orgs.Organization.setProperty(user.account.accountid, 'testProperty', 'test-value')
      const value = await orgs.Organization.getProperty(user.account.accountid, 'testProperty')
      assert.equal(value, 'test-value')
    })
  })

  describe('Organization#getProperty', () => {
    it('should require an organizationid', async () => {
      let errorMessage
      try {
        await orgs.Organization.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      let errorMessage
      try {
        await orgs.Organization.getProperty(user.account.accountid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should retrieve the property', async () => {
      const user = await TestHelper.createUser()
      const organization = await orgs.Organization.create(user.account.accountid, 'another-organization')
      await orgs.Organization.setProperty(organization.organizationid, 'testProperty', 'test-value')
      const stringValue = await orgs.Organization.getProperty(organization.organizationid, 'testProperty')
      assert.equal(stringValue, 'test-value')
      await orgs.Organization.setProperty(organization.organizationid, 'testProperty', 1234)
      const organizationNow = await orgs.Organization.load(organization.organizationid)
      assert.strictEqual(organizationNow.testProperty, 1234)
    })
  })

  describe('Organization#removeProperty', () => {
    it('should require an organizationid', async () => {
      let errorMessage
      try {
        await orgs.Organization.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      let errorMessage
      try {
        await orgs.Organization.getProperty(user.account.accountid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should remove the property', async () => {
      const user = await TestHelper.createUser()
      await orgs.Organization.setProperty(user.account.accountid, 'testProperty', 'test-value')
      await orgs.Organization.removeProperty(user.account.accountid, 'testProperty')
      const stringValue = await orgs.Organization.getProperty(user.account.accountid, 'testProperty')
      assert.equal(stringValue, null)
    })
  })
})
