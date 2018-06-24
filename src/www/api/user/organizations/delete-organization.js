const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await orgs.Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
  },
  delete: async (req) => {
    await orgs.Organization.deleteOrganization(req.query.organizationid)
    await dashboard.RedisList.remove(`organizations`, req.query.organizationid)
    await dashboard.RedisList.remove(`account:organizations:${req.account.accountid}`, req.query.organizationid)
    req.success = true
  }
}
