const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    if (!req.body || !req.body.name) {
      throw new Error('invalid-membership-name')
    }
    if (!req.body.name || !req.body.name.length) {
      throw new Error('invalid-membership-name')
    }
    if (global.minimumMembershipNameLength > req.body.name.length ||
        global.maximumMembershipNameLength < req.body.name.length) {
      throw new Error('invalid-membership-name-length')
    }
    if (!req.body.email || !req.body.email.length) {
      throw new Error('invalid-membership-email')
    }
    const membership = await global.api.user.organizations.Membership.get(req)
    if (!membership || membership.accountid !== req.account.accountid) {
      throw new Error('invalid-membership')
    }
  },
  patch: async (req) => {
    await dashboard.StorageObject.setProperties(`${req.appid}/membership/${req.query.membershipid}`, {
      name: req.body.name,
      email: req.body.email
    })
    req.success = true
    return global.api.user.organizations.Membership.get(req)
  }
}
