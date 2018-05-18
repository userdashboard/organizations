module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    const membership = await global.organizations.Membership.load(req.query.membershipid)
    if (!membership) {
      throw new Error('invalid-membership')
    }
    const organization = await global.organizations.Organization.load(membership.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    if (organization.ownerid !== req.account.accountid && membership.accountid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    const owner = await global.dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-membership')
    }
  },
  delete: async (req) => {
    await global.organizations.Membership.deleteMembership(req.query.membershipid)
    req.session = await global.dashboard.Session.load(req.session.sessionid)
    req.success = true
  }
}
