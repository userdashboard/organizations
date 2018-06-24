const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await orgs.Organization.load(req.query.organizationid)
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const membershipids = await dashboard.RedisList.list(`organization:memberships:${req.query.organizationid}`, offset)
    if (!membershipids || !membershipids.length) {
      return null
    }
    const memberships = await orgs.Membership.loadMany(membershipids)
    if (organization.ownerid === req.account.accountid) {
      return memberships
    }
    for (const membership of memberships) {
      if (membership.accountid === req.account.accountid) {
        return memberships
      }
    }
    throw new Error('invalid-account')
  }
}
