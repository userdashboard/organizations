/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/transfer-organization', () => {
  describe('TransferOrganization#PATCH', () => {
    it('should require own organization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const other = await TestHelper.createUser()
      await TestHelper.createOrganization(other)
      const req = TestHelper.createRequest(`/api/user/organizations/transfer-organization?organizationid=${other.organization.organizationid}`, 'PATCH')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        accountid: other.account.accountid
      }
      let errorMessage
      try {
        await req.route.api.patch(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-organization')
    })

    it('should reject same owner', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const req = TestHelper.createRequest(`/api/user/organizations/transfer-organization?organizationid=${owner.organization.organizationid}`, 'PATCH')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        accountid: owner.account.accountid
      }
      let errorMessage
      try {
        await req.route.api.patch(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-account')
    })

    it('should require new owner is member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/organizations/transfer-organization?organizationid=${owner.organization.organizationid}`, 'PATCH')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        accountid: user.account.accountid
      }
      let errorMessage
      try {
        await req.route.api.patch(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.equal(errorMessage, 'invalid-account')
    })

    it('should transfer organization after authorization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner)
      const user = await TestHelper.createUser()
      await TestHelper.createMembership(user, owner.organization.organizationid)
      const req = TestHelper.createRequest(`/api/user/organizations/transfer-organization?organizationid=${owner.organization.organizationid}`, 'PATCH')
      req.account = owner.account
      req.session = owner.session
      req.body = {
        accountid: user.account.accountid
      }
      await req.route.api.patch(req)
      await TestHelper.completeAuthorization(req)
      const organizationNow = await req.route.api.patch(req)
      assert.notEqual(null, organizationNow)
      assert.equal(user.account.accountid, organizationNow.ownerid)
    })
  })
})
