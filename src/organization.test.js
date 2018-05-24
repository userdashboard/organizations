/* eslint-env mocha */
const assert = require('assert')
const dashboard = require('@userappstore/dashboard')
const Organization = require('./organization.js')
const TestHelper = require('./test-helper.js')

describe('internal-api/organization', async () => {
  describe('Organization#create()', () => {
    it('should require organization name', async () => {
      const user = await TestHelper.createUser()
      const name = null
      let errorMessage
      try {
        await Organization.create(user.account.accountid, name)
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
        await Organization.create(user.account.accountid, name)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization-name-length')
      errorMessage = null
      try {
        global.MAXIMUM_ORGANIZATION_NAME_LENGTH = 1
        await Organization.create(user.account.accountid, name)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization-name-length')
    })

    it('should create an organization', async () => {
      const user = await TestHelper.createUser()
      const organization = await Organization.create(user.account.accountid, 'org-name')
      assert.notEqual(organization, null)
    })

    it('should update the user\'s last organization created date', async () => {
      const user = await TestHelper.createUser()
      const initialLastCreated = await dashboard.Account.getProperty(user.account.accountid, 'organization _lastCreated')
      assert.equal(initialLastCreated, null)
      await Organization.create(user.account.accountid, 'org2-name')
      const lastCreated = await dashboard.Account.getProperty(user.account.accountid, 'organization_lastCreated')
      assert.notEqual(lastCreated, null)
    })
  })

  describe('Organization#delete', () => {
    it('should require a valid organizationid', async () => {
      let errorMessage
      try {
        await Organization.deleteOrganization()
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should delete organization', async () => {
      const user = await TestHelper.createUser()
      const organization = await Organization.create(user.account.accountid, 'organization-name')
      await Organization.deleteOrganization(organization.organizationid)
      let errorMessage
      try {
        await Organization.load(organization.organizationid)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })
  })

  describe('Organization#setProperty', () => {
    it('should require an organizationid', async () => {
      let errorMessage
      try {
        await Organization.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      let errorMessage
      try {
        await Organization.getProperty(user.account.accountid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should require a value', async () => {
      const user = await TestHelper.createUser()
      let errorMessage
      try {
        await Organization.setProperty(user.account.accountid, 'property')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-value')
    })

    it('should set the property', async () => {
      const user = await TestHelper.createUser()
      await Organization.setProperty(user.account.accountid, 'testProperty', 'test-value')
      const value = await Organization.getProperty(user.account.accountid, 'testProperty')
      assert.equal(value, 'test-value')
    })
  })

  describe('Organization#getProperty', () => {
    it('should require an organizationid', async () => {
      let errorMessage
      try {
        await Organization.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      let errorMessage
      try {
        await Organization.getProperty(user.account.accountid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should retrieve the property', async () => {
      const user = await TestHelper.createUser()
      const organization = await Organization.create(user.account.accountid, 'another-organization')
      await Organization.setProperty(organization.organizationid, 'testProperty', 'test-value')
      const stringValue = await Organization.getProperty(organization.organizationid, 'testProperty')
      assert.equal(stringValue, 'test-value')
      await Organization.setProperty(organization.organizationid, 'testProperty', 1234)
      const organizationNow = await Organization.load(organization.organizationid)
      assert.strictEqual(organizationNow.testProperty, 1234)
    })
  })

  describe('Organization#removeProperty', () => {
    it('should require an organizationid', async () => {
      let errorMessage
      try {
        await Organization.getProperty(null, 'property', 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organizationid')
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      let errorMessage
      try {
        await Organization.getProperty(user.account.accountid, null, 'value')
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-property')
    })

    it('should remove the property', async () => {
      const user = await TestHelper.createUser()
      await Organization.setProperty(user.account.accountid, 'testProperty', 'test-value')
      await Organization.removeProperty(user.account.accountid, 'testProperty')
      const stringValue = await Organization.getProperty(user.account.accountid, 'testProperty')
      assert.equal(stringValue, null)
    })
  })
})
