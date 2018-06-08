const orgs = require('../../index.js')

module.exports = {
  after: async (req) => {
    const memberships = await orgs.Membership.list(req.account.accountid)
    if (!memberships || !memberships.length) {
      return
    }
    req.memberships = memberships
  }
}
