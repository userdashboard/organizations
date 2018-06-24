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
      const isMember = await orgs.Membership.isMember(organization.organizationid, req.account.accountid)
      if (!isMember) {
        throw new Error('invalid-membership')
      }
    }
    return membership
  }
}
