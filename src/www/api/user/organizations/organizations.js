const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    if (req.query.accountid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const organizationids = await dashboard.RedisList.list(`account:organizations:${req.query.accountid}`, offset)
    if (!organizationids || !organizationids.length) {
      return null
    }
    const organizations = await orgs.Organization.loadMany(organizationids)
    return organizations
  }
}
