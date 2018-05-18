module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    if (req.body.accountid === req.account.accountid) {
      throw new Error('invalid-account')
    }
    const organization = await global.organizations.Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
    if (!req.body || !req.body.accountid) {
      throw new Error('invalid-accountid')
    }
    const newOwner = await global.dashboard.Account.load(req.body.accountid)
    if (!newOwner || newOwner.deleted) {
      throw new Error('invalid-account')
    }
    const nonMember = await global.organizations.Membership.isUniqueMembership(req.query.organizationid, req.body.accountid)
    if (nonMember) {
      throw new Error('invalid-account')
    }
    const owner = await global.dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
  },
  patch: async (req) => {
    await global.organizations.Organization.setProperty(req.query.organizationid, 'ownerid', req.body.accountid)
    req.success = true
    return global.organizations.Organization.load(req.query.organizationid)
  }
}
