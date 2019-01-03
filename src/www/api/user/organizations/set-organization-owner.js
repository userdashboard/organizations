const dashboard = require('@userappstore/dashboard')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    if (req.body.accountid === req.account.accountid) {
      throw new Error('invalid-account')
    }
    const organization = await global.api.user.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    if (!req.body || !req.body.accountid) {
      throw new Error('invalid-accountid')
    }
    let membership
    try {
      const membershipReq = { query: { organizationid: req.query.organizationid }, account: { accountid: req.body.accountid }, appid: req.appid }
      membership = await global.api.user.organizations.OrganizationMembership._get(membershipReq)
    } catch (error) {
    }
    if (!membership) {
      throw new Error('invalid-account')
    }
    const accountReq = { query: { accountid: req.body.accountid }, account: { accountid: req.body.accountid }, appid: req.appid }
    const newOwner = await global.api.user.Account._get(accountReq)
    if (!newOwner || newOwner.deleted) {
      throw new Error('invalid-account')
    }
    req.data = { organization }
  },
  patch: async (req) => {
    await dashboard.StorageObject.setProperty(`${req.appid}/organization/${req.query.organizationid}`, 'ownerid', req.body.accountid)
    req.success = true
    req.data.organization.ownerid = req.body.accountid
    return req.data.organization
  }
}
