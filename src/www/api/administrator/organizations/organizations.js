const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const organizationids = await dashboard.RedisList.list(`organizations`, offset)
    if (!organizationids || !organizationids.length) {
      return null
    }
    const organizations = await orgs.Organization.loadMany(organizationids)
    return organizations
  }
}
