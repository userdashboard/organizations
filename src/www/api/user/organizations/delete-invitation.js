const dashboard = require('@userappstore/dashboard')
const Invitation = require('../../../../invitation.js')
const Organization = require('../../../../organization.js')

module.exports = {
  delete: async (req) => {
    if (!req || !req.account) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    const invitation = await Invitation.load(req.query.invitationid)
    if (!invitation || invitation.accepted) {
      throw new Error('invalid-invitation')
    }
    const organization = await Organization.load(invitation.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
    const owner = await dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
    if (!req.session.deleteInvitationRequested) {
      await dashboard.Session.setProperty(req.session.sessionid, `deleteInvitationRequested`, req.query.invitationid)
      await dashboard.Session.lock(req.session.sessionid, req.url)
      req.session = await dashboard.Session.load(req.session.sessionid)
      if (!req.session.unlocked) {
        return
      }
    }
    // apply authorized changes
    if (req.session.deleteInvitationRequested === req.query.invitationid && req.session.unlocked >= dashboard.Timestamp.now) {
      await dashboard.Session.removeProperty(req.session.sessionid, 'deleteInvitationRequested')
      await Invitation.deleteInvitation(req.query.invitationid)
      req.account = await dashboard.Account.load(req.account.accountid)
      req.session = await dashboard.Session.load(req.session.sessionid)
      return true
    }
    throw new Error('invalid-invitation')
  }
}
