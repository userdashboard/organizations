const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const invitations = await orgs.Invitation.listAllByOrganization(req.query.organizationid, offset)
    if (!invitations || !invitations.length) {
      return null
    }
    for (const invitation of invitations) {
      delete (invitation.code)
    }
    return invitations
  }
}
