const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    if (!req.body || !req.body.code) {
      throw new Error('invalid-invitation-code')
    }
    if (global.MINIMUM_INVITATION_CODE_LENGTH > req.body.code.length ||
      global.MAXIMUM_INVITATION_CODE_LENGTH < req.body.code.length) {
      throw new Error('invalid-invitation-code-length')
    }
    const invitation = await orgs.Invitation.load(req.query.invitationid)
    if (!invitation || (invitation.accepted && invitation.accepted !== req.account.accountid)) {
      throw new Error('invalid-invitation')
    }
    const organization = await orgs.Organization.load(invitation.organizationid)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid === req.account.accountid) {
      throw new Error('invalid-account')
    }
    const member = await orgs.Membership.isMember(organization.organizationid, req.account.accountid)
    if (member) {
      throw new Error('invalid-account')
    }
    req.body.organizationid = invitation.organizationid
  },
  patch: async (req) => {
    await orgs.Invitation.accept(req.body.organizationid, req.body.code, req.account.accountid)
    const membership = await orgs.Membership.create(req.body.organizationid, req.account.accountid)
    await orgs.Membership.setProperty(membership.membershipid, 'ip', req.ip)
    await orgs.Membership.setProperty(membership.membershipid, 'userAgent', req.headers['user-agent'] || '')
    await orgs.Membership.setProperty(membership.membershipid, 'invitationid', req.query.invitationid)
    await orgs.Invitation.setProperty(req.query.invitationid, 'membershipid', membership.membershipid)
    req.session = await dashboard.Session.load(req.session.sessionid)
    req.success = true
    return membership
  }
}
