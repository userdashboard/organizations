/* eslint-env mocha */
const assert = require('assert')
const orgs = require('../index.js')
const TestHelper = require('../test-helper.js')

describe('internal-api/membership', async () => {
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
})
