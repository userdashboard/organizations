module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await global.organizations.Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
    const invitations = await global.organizations.Invitation.list(req.query.organizationid)
    if (!invitations || !invitations.length) {
      return null
    }
    for (const invitation of invitations) {
      delete (invitation.code)
    }
    return invitations
  }
}
