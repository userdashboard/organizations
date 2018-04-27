const dashboard = require('@userappstore/dashboard')
const Membership = require('../../../../membership.js')
const Organization = require('../../../../organization.js')

module.exports = {
  delete: async (req) => {
    if (!req || !req.account) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
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
    // queue change for authorization
    if (!req.session.deleteMembershipRequested) {
      await dashboard.Session.setProperty(req.session.sessionid, `deleteMembershipRequested`, req.query.membershipid)
      await dashboard.Session.lock(req.session.sessionid, req.url)
      req.session = await dashboard.Session.load(req.session.sessionid)
      if (!req.session.unlocked) {
        return
      }
    }
    // apply authorized changes
    if (req.session.deleteMembershipRequested === req.query.membershipid && req.session.unlocked >= dashboard.Timestamp.now) {
      await dashboard.Session.removeProperty(req.session.sessionid, 'deleteMembershipRequested')
      await Membership.deleteMembership(req.query.membershipid)
      req.account = await dashboard.Account.load(req.account.accountid)
      req.session = await dashboard.Session.load(req.session.sessionid)
      return true
    }
    throw new Error('invalid-membership')
  }
}
