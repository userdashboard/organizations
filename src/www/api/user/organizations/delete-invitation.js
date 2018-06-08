const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
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
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
  },
  delete: async (req) => {
    await orgs.Invitation.deleteInvitation(req.query.invitationid)
    req.session = await dashboard.Session.load(req.session.sessionid)
    req.success = true
  }
}
