const dashboard = require('@userappstore/dashboard')
const Organization = require('../../../../organization.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
    const owner = await dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
  },
  delete: async (req) => {
    await Organization.deleteOrganization(req.query.organizationid)
    req.session = await dashboard.Session.load(req.session.sessionid)
    req.success = true
  }
}
