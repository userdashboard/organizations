const dashboard = require('@userappstore/dashboard')
const Membership = require('../../../../membership.js')
const Organization = require('../../../../organization.js')

module.exports = {
  patch: async (req) => {
    if (!req || !req.account) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
    // queue change for authorization
    if (!req.session.transferOrganizationRequested) {
      if (!req.body || !req.body.accountid) {
        throw new Error('invalid-accountid')
      }
      const newOwner = await dashboard.Account.load(req.body.accountid)
      if (!newOwner || newOwner.deleted) {
        throw new Error('invalid-accountid')
      }
      const nonMember = await Membership.isUniqueMembership(req.query.organizationid, req.body.accountid)
      if (nonMember) {
        throw new Error('invalid-accountid')
      }
      await dashboard.Session.setProperty(req.session.sessionid, `transferOrganizationRequested`, req.query.organizationid)
      await dashboard.Session.setProperty(req.session.sessionid, `transferOrganizationOwnerRequested`, req.body.accountid)
      await dashboard.Session.lock(req.session.sessionid, req.url)
      req.session = await dashboard.Session.load(req.session.sessionid)
      if (!req.session.unlocked) {
        return
      }
    }
    const owner = await dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
    // apply authorized changes
    if (req.session.transferOrganizationRequested === req.query.organizationid && req.session.unlocked >= dashboard.Timestamp.now) {
      await dashboard.Session.removeProperty(req.session.sessionid, 'transferOrganizationRequested')
      await dashboard.Session.removeProperty(req.session.sessionid, 'transferOrganizationOwnerRequested')
      await Organization.setProperty(req.query.organizationid, 'ownerid', req.session.transferOrganizationOwnerRequested)
      req.account = await dashboard.Account.load(req.account.accountid)
      req.session = await dashboard.Session.load(req.session.sessionid)
      return true
    }
    throw new Error('invalid-organization')
  }
}
