const orgs = require('../../index.js')

module.exports = {
  after: async (req) => {
    const memberships = await orgs.Membership.list(req.account.accountid)
    if (!memberships || !memberships.length) {
      req.headers['x-memberships'] = ''
      return
    }
    req.headers['x-memberships'] = JSON.stringify(memberships)
  }
}
