module.exports = {
  get: async (req) => {
    const filter = req.query && req.query.organizationid ? req.query.organizationid : null
    const invitations = await global.organizations.Invitation.listAll(filter)
    if (!invitations || !invitations.length) {
      return null
    }
    for (const invitation of invitations) {
      delete (invitation.code)
    }
    return invitations
  }
}
