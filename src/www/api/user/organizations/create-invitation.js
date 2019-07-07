const dashboard = require('@userappstore/dashboard')

module.exports = {
  post: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    if (!req.body || !req.body.code) {
      throw new Error('invalid-invitation-code')
    }
    if (global.minimumInvitationCodeLength > req.body.code.length ||
      global.maximumInvitationCodeLength < req.body.code.length) {
      throw new Error('invalid-invitation-code-length')
    }
    const organization = await global.api.user.organizations.Organization._get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    const codeHash = await dashboard.Hash.fixedSaltHash(req.body.code, req.alternativeFixedSalt, req.alternativeDashboardEncryptionKey)
    const invitationid = `invitation_${await dashboard.UUID.generateID()}`
    const invitationInfo = {
      object: `invitation`,
      organizationid: req.query.organizationid,
      invitationid,
      codeHash,
      created: dashboard.Timestamp.now
    }
    await dashboard.Storage.write(`${req.appid}/invitation/${invitationid}`, invitationInfo)
    await dashboard.StorageList.add(`${req.appid}/invitations`, invitationid)
    await dashboard.StorageList.add(`${req.appid}/account/invitations/${req.account.accountid}`, invitationid)
    await dashboard.StorageList.add(`${req.appid}/organization/invitations/${req.query.organizationid}`, invitationid)
    await dashboard.Storage.write(`${req.appid}/map/invitationid/organizationid/${invitationid}`, req.query.organizationid)
    req.success = true
    req.query.invitationid = invitationid
    return invitationInfo
  }
}
