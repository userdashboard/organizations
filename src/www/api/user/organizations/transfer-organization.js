const dashboard = require('@userappstore/dashboard')
const Membership = require('../../../../membership.js')
const Organization = require('../../../../organization.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    if (req.body.accountid === req.account.accountid) {
      throw new Error('invalid-account')
    }
    const organization = await Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
    if (!req.body || !req.body.accountid) {
      throw new Error('invalid-accountid')
    }
    const newOwner = await dashboard.Account.load(req.body.accountid)
    if (!newOwner || newOwner.deleted) {
      throw new Error('invalid-account')
    }
    const nonMember = await Membership.isUniqueMembership(req.query.organizationid, req.body.accountid)
    if (nonMember) {
      throw new Error('invalid-account')
    }
    const owner = await dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
  },
  patch: async (req) => {
    await Organization.setProperty(req.query.organizationid, 'ownerid', req.body.accountid)
    req.success = true
    return Organization.load(req.query.organizationid)
  }
}
