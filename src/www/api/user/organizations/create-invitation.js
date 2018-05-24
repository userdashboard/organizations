const dashboard = require('@userappstore/dashboard')
const Invitation = require('../../../../invitation.js')
const Organization = require('../../../../organization.js')

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
    const organization = await Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organizationid')
    }
    const owner = await dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
    req.body.code = await dashboard.Hash.fixedSaltHash(req.body.code)
  },
  post: async (req) => {
    const invitation = await Invitation.create(req.query.organizationid, req.body.code)
    await Invitation.setProperty(invitation.invitationid, 'ip', req.ip)
    await Invitation.setProperty(invitation.invitationid, 'userAgent', req.headers['user-agent'] || '')
    req.session = await dashboard.Session.load(req.session.sessionid)
    req.success = true
    return invitation
  }
}
