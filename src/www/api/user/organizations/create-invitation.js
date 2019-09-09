const dashboard = require('@userdashboard/dashboard')

module.exports = {
  post: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    if (!req.body || !req.body['secret-code']) {
      throw new Error('invalid-secret-code')
    }
    if (global.minimumInvitationCodeLength > req.body['secret-code'].length ||
      global.maximumInvitationCodeLength < req.body['secret-code'].length) {
      throw new Error('invalid-secret-code-length')
    }
    const organization = await global.api.user.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    const secretCodeHash = await dashboard.Hash.fixedSaltHash(req.body['secret-code'], req.alternativeFixedSalt, req.alternativeDashboardEncryptionKey)
    const invitationid = `invitation_${await dashboard.UUID.generateID()}`
    const invitationInfo = {
      object: `invitation`,
      organizationid: req.query.organizationid,
      invitationid,
      secretCodeHash,
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
