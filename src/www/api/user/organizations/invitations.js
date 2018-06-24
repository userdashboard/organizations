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
    const invitationids = await dashboard.RedisList.list(`account:invitations:${req.query.accountid}`, offset)
    if (!invitationids || !invitationids.length) {
      return null
    }
    const invitations = await orgs.Invitation.loadMany(invitationids)
    for (const invitation of invitations) {
      delete (invitation.code)
    }
    return invitations
  }
}
