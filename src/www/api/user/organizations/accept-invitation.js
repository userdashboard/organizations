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
    const invitation = await global.organizations.Invitation.load(req.query.invitationid)
    if (!invitation || (invitation.accepted && invitation.accepted !== req.account.accountid)) {
      throw new Error('invalid-invitation')
    }
    const organization = await global.organizations.Organization.load(invitation.organizationid)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid === req.account.accountid) {
      throw new Error('invalid-account')
    }
    const unique = await global.organizations.Membership.isUniqueMembership(organization.organizationid, req.account.accountid)
    if (!unique) {
      throw new Error('invalid-account')
    }
    req.body.organizationid = invitation.organizationid
  },
  patch: async (req) => {
    await global.organizations.Invitation.accept(req.body.organizationid, req.body.code, req.account.accountid)
    const membership = await global.organizations.Membership.create(req.body.organizationid, req.account.accountid)
    await global.organizations.Membership.setProperty(membership.membershipid, 'ip', req.ip)
    await global.organizations.Membership.setProperty(membership.membershipid, 'userAgent', req.headers['user-agent'] || '')
    await global.organizations.Membership.setProperty(membership.membershipid, 'invitationid', req.query.invitationid)
    await global.organizations.Invitation.setProperty(req.query.invitationid, 'membershipid', membership.membershipid)
    req.session = await global.dashboard.Session.load(req.session.sessionid)
    req.success = true
    return membership
  }
}
