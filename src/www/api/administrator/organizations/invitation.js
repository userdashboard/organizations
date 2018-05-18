module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    const invitation = await global.organizations.Invitation.load(req.query.invitationid)
    if (!invitation) {
      throw new Error('invalid-invitation')
    }
    const organization = await global.organizations.Organization.load(invitation.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    const owner = await global.dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
    delete (invitation.code)
    return invitation
  }
}
