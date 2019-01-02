const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    if (req.body && req.body.codeHash) {
      return
    }
    if (!req.body || !req.body.code) {
      throw new Error('invalid-invitation-code')
    }
    if (global.minimumInvitationCodeLength > req.body.code.length ||
      global.maximumInvitationCodeLength < req.body.code.length) {
      throw new Error('invalid-invitation-code-length')
    }
    const organization = await global.api.user.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    req.body.codeHash = await dashboard.Hash.fixedSaltHash(req.body.code, req.alternativeFixedSalt, req.alternativeDashboardEncryptionKey)
    delete (req.body.code)
  },
  post: async (req) => {
    const invitationid = `invitation_${await dashboard.UUID.generateID()}`
    const invitationInfo = {
      object: `invitation`,
      organizationid: req.query.organizationid,
      invitationid: invitationid,
      codeHash: req.body.codeHash,
      created: dashboard.Timestamp.now
    }
    await dashboard.Storage.write(`${req.appid}/${invitationid}`, invitationInfo)
    await dashboard.StorageList.add(`${req.appid}/invitations`, invitationid)
    await dashboard.StorageList.add(`${req.appid}/account/invitations/${req.account.accountid}`, invitationid)
    await dashboard.StorageList.add(`${req.appid}/organization/invitations/${req.query.organizationid}`, invitationid)
    await dashboard.Storage.write(`${req.appid}/map/invitationid/organizationid/${invitationid}`, req.query.organizationid)
    req.success = true
    req.query.invitationid = invitationid
    return invitationInfo
  }
}
