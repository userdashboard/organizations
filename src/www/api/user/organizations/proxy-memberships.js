module.exports = {
  get: async (req) => {
    const memberships = await global.dashboard.organizations.Membership.listByAccount(req.account.accountid)
    if (!memberships || !memberships.length) {
      req.headers['x-memberships'] = ''
      return
    }
    for (const membership of memberships) {
      const organization = await global.dashboard.organizations.Organization.load(membership.organizationid)
      if (!organization) {
        throw new Error('invalid-organization')
      }
      const owner = await global.dashboard.Account.load(organization.ownerid)
      if (!owner || owner.deleted) {
        throw new Error('invalid-organization')
      }
      membership.organization = organization
      if (membership.invitationid) {
        const invitation = await global.dashboard.organizations.Invitation.load(membership.invitationid)
        if (!invitation) {
          throw new Error('invalid-invitation')
        }
        membership.invitation = invitation
      }
    }
    req.headers['x-memberships'] = JSON.stringify(memberships)
  }
}
