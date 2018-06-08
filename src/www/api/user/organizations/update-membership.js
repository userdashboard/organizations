const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    if (!req.body) {
      throw new Error('invalid-membership-field')
    }
    for (const property in req.body) {
      if (global.MEMBERSHIP_FIELDS.indexOf(property) === -1) {
        throw new Error('invalid-membership-field')
      }
      if (global.MAXIMUM_MEMBERSHIP_FIELD_LENGTH < req.body[property].length) {
        throw new Error('invalid-membership-field-length')
      }
    }
    const membership = await orgs.Membership.load(req.query.membershipid)
    if (!membership || membership.accountid !== req.account.accountid) {
      throw new Error('invalid-membership')
    }
  },
  patch: async (req) => {
    for (const property in req.body) {
      if (global.MEMBERSHIP_FIELDS.indexOf(property) === -1) {
        continue
      }
      await orgs.Membership.setProperty(req.query.membershipid, property, req.body[property])
    }
    req.session = await dashboard.Session.load(req.session.sessionid)
    req.success = true
    return orgs.Membership.load(req.query.membershipid)
  }
}
