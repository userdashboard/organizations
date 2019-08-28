/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/administrator/organizations/organizations', () => {
  describe('Organizations#BEFORE', () => {
    it('should bind owned organizations to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const req = TestHelper.createRequest('/administrator/organizations/organizations')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.organizations.length, 1)
      assert.strictEqual(req.data.organizations[0].organizationid, owner.organization.organizationid)
    })

    it('should not bind member organizations to req', async () => {
      const administrator = await TestHelper.createAdministrator()
      const owner = await TestHelper.createUser()
      await TestHelper.createOrganization(owner, { email: owner.profile.contactEmail, name: 'My organization' })
      const user = await TestHelper.createUser()
      await TestHelper.createInvitation(owner)
      await TestHelper.acceptInvitation(user, owner)
      const req = TestHelper.createRequest('/administrator/organizations/organizations')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.organizations.length, 1)
    })
  })

  describe('Organizations#GET', () => {
    it('should limit organizations to one page', async () => {
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(user, { email: user.profile.contactEmail, name: 'My organization' })
      }
      const req = TestHelper.createRequest('/administrator/organizations/organizations')
      req.account = administrator.account
      req.session = administrator.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('organizations-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce page size', async () => {
      global.pageSize = 3
      const administrator = await TestHelper.createAdministrator()
      const user = await TestHelper.createUser()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        await TestHelper.createOrganization(user, { email: user.profile.contactEmail, name: 'My organization' })
      }
      const req = TestHelper.createRequest('/administrator/organizations/organizations')
      req.account = administrator.account
      req.session = administrator.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      const table = doc.getElementById('organizations-table')
      const rows = table.getElementsByTagName('tr')
      assert.strictEqual(rows.length, global.pageSize + 1)
    })

    it('should enforce specified offset', async () => {
      const offset = 1
      const administrator = await TestHelper.createAdministrator()
      const organizations = []
      for (let i = 0, len = global.pageSize + offset + 1; i < len; i++) {
        const user = await TestHelper.createUser()
        const organization = await TestHelper.createOrganization(user, { email: user.profile.contactEmail, name: 'My organization' })
        organizations.unshift(organization)
      }
      const req = TestHelper.createRequest(`/administrator/organizations/organizations?offset=${offset}`)
      req.account = administrator.account
      req.session = administrator.session
      const page = await req.get(req)
      const doc = TestHelper.extractDoc(page)
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(doc.getElementById(organizations[offset + i].organizationid).tag, 'tr')
      }
    })
  })
})
