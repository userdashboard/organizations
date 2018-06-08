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
    const organization = await orgs.Organization.load(invitation.organizationid)
    if (organization.ownerid !== req.account.accountid) {
      const member = await orgs.Membership.isMember(invitation.organizationid, req.account.accountid)
      if (member) {
        throw new Error('invalid-account')
      }
    }
    invitation.organization = organization
    delete (invitation.code)
    return invitation
  }
}
