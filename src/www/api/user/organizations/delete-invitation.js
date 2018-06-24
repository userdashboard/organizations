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
    await dashboard.RedisList.remove(`invitations`, req.query.invitationid)
    await dashboard.RedisList.remove(`account:invitations:${req.account.accountid}`, req.query.invitationid)
    await dashboard.RedisList.remove(`organization:invitations:${req.body.organizationid}`, req.query.invitationid)
    req.success = true
  }
}
