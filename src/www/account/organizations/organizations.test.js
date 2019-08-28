/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/account/organizations/organizations', () => {
  describe('Organizations#BEFORE', () => {
    it('should bind owned organizations to req', async () => {
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const req = TestHelper.createRequest('/account/organizations/organizations')
      req.account = owner.account
      req.session = owner.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.organizations[0].organizationid, owner.organization.organizationid)
    })
  })

  describe('Organizations#GET', () => {
    it('should limit organizations to one page', async () => {
      const owner = await TestHelper.createUser()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      }
      const req = TestHelper.createRequest('/account/organizations/organizations')
      req.account = owner.account
      req.session = owner.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('organizations-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const owner = await TestHelper.createUser()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      }
      const req = TestHelper.createRequest('/account/organizations/organizations')
      req.account = owner.account
      req.session = owner.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('organizations-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const owner = await TestHelper.createUser()
      const organizations = []
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
        organizations.unshift(owner.organization)
      }
      const req = TestHelper.createRequest(`/account/organizations/organizations?offset=${offset}`)
      req.account = owner.account
      req.session = owner.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(doc.getElementById(organizations[offset + i].organizationid).tag, 'tr')
      }
    })
  })
})
