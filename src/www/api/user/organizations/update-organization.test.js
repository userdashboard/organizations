/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/api/user/organizations/update-organization', async () => {
  it('should reject invalid fields', async () => {
    const owner = await TestHelper.createUser()
    await TestHelper.createOrganization(owner)
    const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`, 'PATCH')
    req.account = owner.account
    req.session = owner.session
    req.body = {
      invalidField: 'field'
    }
    try {
      await req.route.api.patch(req)
    } catch (error) {
      assert.equal(error.message, 'invalid-organization-field')
    }
  })

  it('should enforce field length', async () => {
    const owner = await TestHelper.createUser()
    await TestHelper.createOrganization(owner)
    const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`, 'PATCH')
    req.account = owner.account
    req.session = owner.session
    req.body = {
      name: 'this-is-too-long-to-be-a-first-name-of-anyone',
      email: 'test@test.com'
    }
    global.MAXIMUM_ORGANIZATION_FIELD_LENGTH = 10
    try {
      await req.route.api.patch(req)
    } catch (error) {
      global.MAXIMUM_ORGANIZATION_FIELD_LENGTH = 100
      assert.equal(error.message, 'invalid-organization-field-length')
    }
  })

  it('should apply new values', async () => {
    const owner = await TestHelper.createUser()
    await TestHelper.createOrganization(owner)
    const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`, 'PATCH')
    req.account = owner.account
    req.session = owner.session
    req.body = {
      name: 'Person',
      email: 'test@test.com'
    }
    await req.route.api.patch(req)
    await TestHelper.completeAuthorization(req)
    await req.route.api.patch(req)
    const req2 = TestHelper.createRequest(`/api/user/organizations/organization?organizationid=${owner.organization.organizationid}`, 'GET')
    req2.account = owner.account
    req2.session = owner.session
    const organizationNow = await req2.route.api.get(req2)
    assert.equal(organizationNow.name, 'Person')
    assert.equal(organizationNow.email, 'test@test.com')
  })
})
