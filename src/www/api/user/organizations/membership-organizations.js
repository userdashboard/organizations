const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    if (req.account.accountid !== req.query.accountid) {
      throw new Error('invalid-account')
    }
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const memberships = await orgs.Membership.list(req.query.accountid, offset)
    if (!memberships || !memberships.length) {
      return null
    }
    const organizationids = []
    for (const membership of memberships) {
      organizationids.push(membership.organizationid)
    }
    const organizations = await orgs.Organization.loadMany(organizationids, true)
    if (!organizations || !organizations.length) {
      return null
    }
    return organizations
  }
}
