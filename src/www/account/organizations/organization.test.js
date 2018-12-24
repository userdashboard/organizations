/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe(`/account/organizations/organization`, () => {
  describe('Organization#BEFORE', () => {
    it('should reject non-member', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/account/organizations/organization?organizationid=${owner.organization.organizationid}`)
      req.account = user.account
      req.session = user.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-account')
    })

    it('should bind organization to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/organization?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.organization.organizationid, owner.organization.organizationid)
    })
  })

  describe('Organization#GET', () => {
    it('should have row for organization', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.email, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest(`/account/organizations/organization?organizationid=${owner.organization.organizationid}`)
      req.account = owner.account
      req.session = owner.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const tbody = doc.getElementById(owner.organization.organizationid)
      assert.strictEqual(tbody.tag, 'tbody')
    })
  })
})
