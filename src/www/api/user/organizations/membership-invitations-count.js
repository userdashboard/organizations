const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    if (req.account.accountid !== req.query.accountid) {
      throw new Error('invalid-account')
    }
    const memberships = await orgs.Membership.list(req.query.accountid)
    if (!memberships || !memberships.length) {
      return 0
    }
    const invitationids = []
    for (const membership of memberships) {
      if (!membership.invitationid) {
        continue
      }
      invitationids.push(membership.invitationid)
    }
    return invitationids.length
  }
}
