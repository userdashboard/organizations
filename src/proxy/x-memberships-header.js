const Membership = require('../membership.js')

module.exports = {
  after: async (req) => {
    const memberships = await Membership.listByAccount(req.account.accountid)
    if (!memberships || !memberships.length) {
      req.headers['x-memberships'] = ''
      return
    }
    req.headers['x-memberships'] = JSON.stringify(memberships)
  }
}
