const dashboard = require('@userappstore/dashboard')
const Organization = require('../../../../organization.js')

module.exports = {
  delete: async (req) => {
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
    const owner = await dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
    // queue change for authorization
    if (!req.session.deleteOrganizationRequested) {
      await dashboard.Session.setProperty(req.session.sessionid, `deleteOrganizationRequested`, req.query.organizationid)
      await dashboard.Session.lock(req.session.sessionid, req.url)
      req.session = await dashboard.Session.load(req.session.sessionid)
      if (!req.session.unlocked) {
        return
      }
    }
    // apply authorized changes
    if (req.session.deleteOrganizationRequested === req.query.organizationid && req.session.unlocked >= dashboard.Timestamp.now) {
      await dashboard.Session.removeProperty(req.session.sessionid, 'deleteOrganizationRequested')
      await Organization.deleteOrganization(req.query.organizationid)
      req.session = await dashboard.Session.load(req.session.sessionid)
      return true
    }
    throw new Error('invalid-organization')
  }
}
