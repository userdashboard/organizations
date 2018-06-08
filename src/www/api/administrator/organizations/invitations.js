const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    const filter = req.query && req.query.accountid ? req.query.accountid : null
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const invitations = await orgs.Invitation.listAll(filter, offset)
    if (!invitations || !invitations.length) {
      return null
    }
    for (const invitation of invitations) {
      delete (invitation.code)
    }
    return invitations
  }
}
