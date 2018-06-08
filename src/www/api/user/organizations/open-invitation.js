const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    const invitation = await orgs.Invitation.load(req.query.invitationid)
    if (!invitation) {
      throw new Error('invalid-invitationid')
    }
    if (invitation.accepted) {
      throw new Error('invalid-invitation')
    }
    const organization = await orgs.Organization.load(invitation.organizationid)
    delete (invitation.code)
    return { invitation, organization }
  }
}
