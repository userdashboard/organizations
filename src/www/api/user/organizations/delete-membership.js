const dashboard = require('@userappstore/dashboard')
const Membership = require('../../../../membership.js')
const Organization = require('../../../../organization.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    const membership = await Membership.load(req.query.membershipid)
    if (!membership) {
      throw new Error('invalid-membership')
    }
    const organization = await Organization.load(membership.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    if (organization.ownerid !== req.account.accountid && membership.accountid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    const owner = await dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-membership')
    }
  },
  delete: async (req) => {
    await Membership.deleteMembership(req.query.membershipid)
    req.session = await dashboard.Session.load(req.session.sessionid)
    req.success = true
  }
}
