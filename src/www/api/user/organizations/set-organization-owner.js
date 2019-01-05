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
    const account = req.account
    try {
      req.account = { accountid: req.body.accountid }
      membership = await global.api.user.organizations.OrganizationMembership.get(req)
    } catch (error) {
    }
    req.account = account
    if (!membership) {
      throw new Error('invalid-account')
    }
    const query = req.query
    req.query.accountid = req.body.accountid
    const newOwner = await global.api.administrator.Account._get(req)
    req.query = query
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
