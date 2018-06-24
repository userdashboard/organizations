const dashboard = require('@userappstore/dashboard')
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
    const membershipids = await dashboard.RedisList.list(`account:memberships:${req.query.accountid}`, offset)
    if (!membershipids || !membershipids.length) {
      return null
    }
    const memberships = await orgs.Membership.loadMany(membershipids)
    return memberships
  }
}
