const Membership = require('../../../../membership.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    if (req.query.accountid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    const memberships = await Membership.listByAccount(req.query.accountid)
    if (!memberships || !memberships.length) {
      return null
    }
    return memberships
  }
}
