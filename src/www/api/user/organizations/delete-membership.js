const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    const membership = await orgs.Membership.load(req.query.membershipid)
    if (!membership) {
      throw new Error('invalid-membership')
    }
    const organization = await orgs.Organization.load(membership.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    if (organization.ownerid !== req.account.accountid && membership.accountid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
  },
  delete: async (req) => {
    await orgs.Membership.deleteMembership(req.query.membershipid)
    await dashboard.RedisList.remove(`memberships`, req.query.membershipid)
    await dashboard.RedisList.remove(`account:memberships:${req.account.accountid}`, req.query.membershipid)
    await dashboard.RedisList.remove(`organization:memberships:${req.body.organizationid}`, req.query.membershipid)
    req.success = true
  }
}
