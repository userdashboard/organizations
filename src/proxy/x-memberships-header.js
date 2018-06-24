const dashboard = require('@userappstore/dashboard')
const orgs = require('../../index.js')

module.exports = {
  after: async (req) => {
    const membershipids = await dashboard.RedisList.listAll(`account:memberships:${req.account.accountid}`)
    if (!membershipids || !membershipids.length) {
      req.headers['x-memberships'] = ''
      return
    }
    const memberships = await orgs.Membership.loadMany(membershipids)
    req.headers['x-memberships'] = JSON.stringify(memberships)
  }
}
