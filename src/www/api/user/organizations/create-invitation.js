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
    await dashboard.RedisObject.setProperty(invitation.invitationid, 'ip', req.ip)
    await dashboard.RedisObject.setProperty(invitation.invitationid, 'userAgent', req.userAgent)
    await dashboard.RedisList.add(`invitations`, invitation.invitationid)
    await dashboard.RedisList.add(`account:invitations:${req.account.accountid}`, invitation.invitationid)
    await dashboard.RedisList.add(`organization:invitations:${req.query.organizationid}`, invitation.invitationid)
    req.success = true
    return invitation
  }
}
