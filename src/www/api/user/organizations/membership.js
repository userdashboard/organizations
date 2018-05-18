module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    const membership = await global.organizations.Membership.load(req.query.membershipid)
    if (!membership) {
      throw new Error('invalid-membership')
    }
    const organization = await global.organizations.Organization.load(membership.organizationid)
    if (!organization) {
      throw new Error('invalid-membership')
    }
    if (membership.accountid !== req.account.accountid && organization.ownerid !== req.account.accountid) {
      const memberships = await global.organizations.Membership.list(organization.organizationid)
      let isMember = false
      for (const membership of memberships) {
        isMember = membership.accountid === req.account.accountid
        if (isMember) {
          break
        }
      }
      if (!isMember) {
        throw new Error('invalid-membership')
      }
    }
    return membership
  }
}
