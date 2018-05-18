module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await global.organizations.Organization.load(req.query.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    if (organization.ownerid !== req.account.accountid) {
      const memberships = await global.organizations.Membership.list(req.query.organizationid)
      if (memberships && memberships.length) {
        let isMember = false
        for (const membership of memberships) {
          isMember = membership.accountid === req.accountid
          if (isMember) {
            break
          }
        }
        if (!isMember) {
          throw new Error('invalid-organization')
        }
      }
    }
    delete (organization.code)
    return organization
  }
}
