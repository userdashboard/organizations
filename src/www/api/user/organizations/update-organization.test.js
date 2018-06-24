/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

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
    let errorMessage
    try {
      await req.route.api.patch(req)
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, 'invalid-organization-field')
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
    let errorMessage
    try {
      await req.route.api.patch(req)
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, 'invalid-organization-field-length')
  })

  it('should apply new values', async () => {
    const owner = await TestHelper.createUser()
    await TestHelper.createOrganization(owner)
    const req = TestHelper.createRequest(`/api/user/organizations/update-organization?organizationid=${owner.organization.organizationid}`, 'PATCH')
    req.account = owner.account
    req.session = owner.session
    req.body = {
      name: 'Organization Name',
      email: 'test@test.com'
    }
    await req.route.api.patch(req)
    req.session = await TestHelper.unlockSession(owner)
    const organizationNow = await req.route.api.patch(req)
    assert.equal(organizationNow.name, 'Organization Name')
    assert.equal(organizationNow.email, 'test@test.com')
  })
})
