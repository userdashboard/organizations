const dashboard = require('@userappstore/dashboard')
const Invitation = require('../../../../invitation.js')
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
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    const invitation = await Invitation.load(req.query.invitationid)
    if (!invitation || (invitation.accepted && invitation.accepted !== req.account.accountid)) {
      throw new Error('invalid-invitation')
    }
    const organization = await Organization.load(invitation.organizationid)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid === req.account.accountid) {
      throw new Error('invalid-account')
    }
    const unique = await Membership.isUniqueMembership(organization.organizationid, req.account.accountid)
    if (!unique) {
      throw new Error('invalid-account')
    }
    // queue change for authorization
    if (!req.session.membershipRequested) {
      if (!req.body || !req.body.code) {
        throw new Error('invalid-invitation-code')
      }
      if (global.MINIMUM_INVITATION_CODE_LENGTH > req.body.code.length ||
        global.MAXIMUM_INVITATION_CODE_LENGTH < req.body.code.length) {
        throw new Error('invalid-invitation-code-length')
      }
      await Invitation.accept(organization.organizationid, req.body.code, req.account.accountid)
      await dashboard.Session.setProperty(req.session.sessionid, `membershipRequested`, req.query.invitationid)
      await dashboard.Session.lock(req.session.sessionid, req.url)
      req.session = await dashboard.Session.load(req.session.sessionid)
      if (!req.session.unlocked) {
        return
      }
    }
    // apply authorized changes
    if (req.session.membershipRequested === req.query.invitationid && req.session.unlocked >= dashboard.Timestamp.now) {
      await dashboard.Session.removeProperty(req.session.sessionid, 'membershipRequested')
      const membership = await Membership.create(organization.organizationid, req.account.accountid)
      await Membership.setProperty(membership.membershipid, 'ip', req.ip)
      await Membership.setProperty(membership.membershipid, 'userAgent', req.headers['user-agent'] || '')
      await Membership.setProperty(membership.membershipid, 'invitationid', req.session.membershipRequested)
      await Invitation.setProperty(req.session.membershipRequested, 'membershipid', membership.membershipid)
      req.account = await dashboard.Account.load(req.account.accountid)
      req.session = await dashboard.Session.load(req.session.sessionid)
      return membership
    }
    throw new Error('invalid-invitation')
  }
}
