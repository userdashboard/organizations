const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    if (req.body.accountid === req.account.accountid) {
      throw new Error('invalid-account')
    }
    const organization = await orgs.Organization.load(req.query.organizationid)
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
    const member = await orgs.Membership.isMember(req.query.organizationid, req.body.accountid)
    if (!member) {
      throw new Error('invalid-account')
    }
  },
  patch: async (req) => {
    await dashboard.RedisObject.setProperty(req.query.organizationid, 'ownerid', req.body.accountid)
    req.success = true
    return orgs.Organization.load(req.query.organizationid)
  }
}
