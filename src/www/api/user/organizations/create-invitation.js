const dashboard = require('@userappstore/dashboard')
const Invitation = require('../../../../invitation.js')
const Organization = require('../../../../organization.js')

module.exports = {
  post: async (req) => {
    if (!req || !req.account) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    // queue change for authorization
    if (!req.session.newInvitationRequested) {
      if (!req.body || !req.body.code) {
        throw new Error('invalid-invitation-code')
      }
      if (global.MINIMUM_INVITATION_CODE_LENGTH > req.body.code.length ||
        global.MAXIMUM_INVITATION_CODE_LENGTH < req.body.code.length) {
        throw new Error('invalid-invitation-code-length')
      }
      const organization = await Organization.load(req.query.organizationid)
      if (!organization || organization.ownerid !== req.account.accountid) {
        throw new Error('invalid-organizationid')
      }
      const owner = await dashboard.Account.load(organization.ownerid)
      if (!owner || owner.deleted) {
        throw new Error('invalid-organization')
      }
      const codeHash = await dashboard.Hash.fixedSaltHash(req.body.code)
      await dashboard.Session.setProperty(req.session.sessionid, `newInvitationRequested`, codeHash)
      await dashboard.Session.lock(req.session.sessionid, req.url)
      req.session = await dashboard.Session.load(req.session.sessionid)
      if (!req.session.unlocked) {
        return
      }
    }
    // apply authorized changes
    if (req.session.newInvitationRequested && req.session.unlocked >= dashboard.Timestamp.now) {
      await dashboard.Session.removeProperty(req.session.sessionid, 'newInvitationRequested')
      const invitation = await Invitation.create(req.query.organizationid, req.session.newInvitationRequested)
      await Invitation.setProperty(invitation.invitationid, 'ip', req.ip)
      await Invitation.setProperty(invitation.invitationid, 'userAgent', req.headers['user-agent'] || '')
      req.account = await dashboard.Account.load(req.account.accountid)
      req.session = await dashboard.Session.load(req.session.sessionid)
      return invitation
    }
  }
}
