/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('./test-helper.js')

describe('internal-api/organization', async () => {
  describe('Organization#create()', () => {
    it('should require organization name', async () => {
      const user = await TestHelper.createUser()
      const name = null
      try {
        await global.dashboard.organizations.Organization.create(user.account.accountid, name)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization-name')
      }
    })

    it('should force organization name length', async () => {
      const user = await TestHelper.createUser()
      const name = '12345'
      try {
        global.MINIMUM_ORGANIZATION_NAME_LENGTH = 100
        await global.dashboard.organizations.Organization.create(user.account.accountid, name)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization-name-length')
      }
      try {
        global.MAXIMUM_ORGANIZATION_NAME_LENGTH = 1
        await global.dashboard.organizations.Organization.create(user.account.accountid, name)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization-name-length')
      }
    })

    it('should create an organization', async () => {
      const user = await TestHelper.createUser()
      const organization = await global.dashboard.organizations.Organization.create(user.account.accountid, 'org-name')
      assert.notEqual(organization, null)
    })

    it('should update the user\'s last organization created date', async () => {
      const user = await TestHelper.createUser()
      const initialLastCreated = await global.dashboard.Account.getProperty(user.account.accountid, 'organization _lastCreated')
      assert.equal(initialLastCreated, null)
      await global.dashboard.organizations.Organization.create(user.account.accountid, 'org2-name')
      const lastCreated = await global.dashboard.Account.getProperty(user.account.accountid, 'organization_lastCreated')
      assert.notEqual(lastCreated, null)
    })
  })

  describe('Organization#delete', () => {
    it('should require a valid organizationid', async () => {
      try {
        await global.dashboard.organizations.Organization.deleteOrganization()
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should delete organization', async () => {
      const user = await TestHelper.createUser()
      const organization = await global.dashboard.organizations.Organization.create(user.account.accountid, 'organization-name')
      await global.dashboard.organizations.Organization.deleteOrganization(organization.organizationid)
      try {
        await global.dashboard.organizations.Organization.load(organization.organizationid)
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })
  })

  describe('Organization#setProperty', () => {
    it('should require an organizationid', async () => {
      try {
        await global.dashboard.organizations.Organization.getProperty(null, 'property', 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      try {
        await global.dashboard.organizations.Organization.getProperty(user.account.accountid, null, 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should require a value', async () => {
      const user = await TestHelper.createUser()
      try {
        await global.dashboard.organizations.Organization.setProperty(user.account.accountid, 'property', null)
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should set the property', async () => {
      const user = await TestHelper.createUser()
      await global.dashboard.organizations.Organization.setProperty(user.account.accountid, 'testProperty', 'test-value')
      const value = await global.dashboard.organizations.Organization.getProperty(user.account.accountid, 'testProperty')
      assert.equal(value, 'test-value')
    })
  })

  describe('Organization#getProperty', () => {
    it('should require an organizationid', async () => {
      try {
        await global.dashboard.organizations.Organization.getProperty(null, 'property', 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      try {
        await global.dashboard.organizations.Organization.getProperty(user.account.accountid, null, 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should retrieve the property', async () => {
      const user = await TestHelper.createUser()
      const organization = await global.dashboard.organizations.Organization.create(user.account.accountid, 'another-organization')
      await global.dashboard.organizations.Organization.setProperty(organization.organizationid, 'testProperty', 'test-value')
      const stringValue = await global.dashboard.organizations.Organization.getProperty(organization.organizationid, 'testProperty')
      assert.equal(stringValue, 'test-value')
      await global.dashboard.organizations.Organization.setProperty(organization.organizationid, 'testProperty', 1234)
      const organizationNow = await global.dashboard.organizations.Organization.load(organization.organizationid)
      assert.strictEqual(organizationNow.testProperty, 1234)
    })
  })

  describe('Organization#removeProperty', () => {
    it('should require an organizationid', async () => {
      try {
        await global.dashboard.organizations.Organization.getProperty(null, 'property', 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-organization')
      }
    })

    it('should require a property', async () => {
      const user = await TestHelper.createUser()
      try {
        await global.dashboard.organizations.Organization.getProperty(user.account.accountid, null, 'value')
      } catch (error) {
        assert.equal(error.message, 'invalid-property')
      }
    })

    it('should remove the property', async () => {
      const user = await TestHelper.createUser()
      await global.dashboard.organizations.Organization.setProperty(user.account.accountid, 'testProperty', 'test-value')
      await global.dashboard.organizations.Organization.removeProperty(user.account.accountid, 'testProperty')
      const stringValue = await global.dashboard.organizations.Organization.getProperty(user.account.accountid, 'testProperty')
      assert.equal(stringValue, null)
    })
  })
})
