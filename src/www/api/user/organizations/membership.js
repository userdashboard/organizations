const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    const membership = await orgs.Membership.load(req.query.membershipid)
    if (!membership) {
      throw new Error('invalid-membershipid')
    }
    const organization = await orgs.Organization.load(membership.organizationid)
    if (!organization) {
      throw new Error('invalid-membership')
    }
    if (membership.accountid !== req.account.accountid && organization.ownerid !== req.account.accountid) {
      const memberships = await orgs.Membership.listByOrganization(organization.organizationid)
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
