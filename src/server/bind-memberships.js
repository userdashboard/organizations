const Membership = require('../../index.js').Membership

module.exports = {
  after: async (req) => {
    const memberships = await Membership.listByAccount(req.account.accountid)
    if (!memberships || !memberships.length) {
      return
    }
    req.memberships = memberships
  }
}
