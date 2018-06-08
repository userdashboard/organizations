const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

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
    const organization = await orgs.Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organizationid')
    }
    req.body.code = await dashboard.Hash.fixedSaltHash(req.body.code)
  },
  post: async (req) => {
    const invitation = await orgs.Invitation.create(req.query.organizationid, req.body.code)
    await orgs.Invitation.setProperty(invitation.invitationid, 'ip', req.ip)
    await orgs.Invitation.setProperty(invitation.invitationid, 'userAgent', req.headers['user-agent'] || '')
    req.session = await dashboard.Session.load(req.session.sessionid)
    req.success = true
    return invitation
  }
}
