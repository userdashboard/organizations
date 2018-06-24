/* eslint-env mocha */
const assert = require('assert')
const orgs = require('../index.js')
const TestHelper = require('../test-helper.js')

describe('internal-api/organization', async () => {
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
})
