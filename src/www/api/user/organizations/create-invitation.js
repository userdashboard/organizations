module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    if (!req.body || !req.body.code) {
      throw new Error('invalid-invitation-code')
    }
    if (global.MINIMUM_INVITATION_CODE_LENGTH > req.body.code.length ||
      global.MAXIMUM_INVITATION_CODE_LENGTH < req.body.code.length) {
      throw new Error('invalid-invitation-code-length')
    }
    const organization = await global.dashboard.organizations.Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organizationid')
    }
    const owner = await global.dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
    req.body.code = await global.dashboard.Hash.fixedSaltHash(req.body.code)
  },
  post: async (req) => {
    const invitation = await global.dashboard.organizations.Invitation.create(req.query.organizationid, req.body.code)
    await global.dashboard.organizations.Invitation.setProperty(invitation.invitationid, 'ip', req.ip)
    await global.dashboard.organizations.Invitation.setProperty(invitation.invitationid, 'userAgent', req.headers['user-agent'] || '')
    req.session = await global.dashboard.Session.load(req.session.sessionid)
    req.success = true
    return invitation
  }
}
