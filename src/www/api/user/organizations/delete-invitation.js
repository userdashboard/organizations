module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    const invitation = await global.dashboard.organizations.Invitation.load(req.query.invitationid)
    if (!invitation || invitation.accepted) {
      throw new Error('invalid-invitation')
    }
    const organization = await global.dashboard.organizations.Organization.load(invitation.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
    const owner = await global.dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
  },
  delete: async (req) => {
    await global.dashboard.organizations.Invitation.deleteInvitation(req.query.invitationid)
    req.session = await global.dashboard.Session.load(req.session.sessionid)
    req.success = true
  }
}
