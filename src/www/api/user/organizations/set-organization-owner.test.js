/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/organizations/set-organization-owner', () => {
  describe('SetOrganizationOwner#BEFORE', () => {
    it('should require own organization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const other = await TestHelper.createUser()
      await TestHelper.createOrganization(other, { email: other.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest(`/api/user/organizations/set-organization-owner?organizationid=${other.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        accountid: other.account.accountid
      }
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should reject same owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const req = TestHelper.createRequest(`/api/user/organizations/set-organization-owner?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        accountid: owner.account.accountid
      }
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should require new owner is member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/set-organization-owner?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        accountid: user.account.accountid
      }
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })
  })

  describe('SetOrganizationOwner#PATCH', () => {
    it('should transfer organization after authorization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner)
      const req = TestHelper.createRequest(`/api/user/organizations/set-organization-owner?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      req.body = {
        accountid: user.account.accountid
      }
      const organizationNow = await req.patch(req)
      assert.strictEqual(user.account.accountid, organizationNow.ownerid)
    })
  })
})
