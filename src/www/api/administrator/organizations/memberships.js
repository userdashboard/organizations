const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const membershipids = await dashboard.RedisList.list(`memberships`, offset)
    if (!membershipids || !membershipids.length) {
      return null
    }
    const memberships = await orgs.Membership.loadMany(membershipids)
    return memberships
  }
}
