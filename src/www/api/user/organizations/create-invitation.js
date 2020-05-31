const dashboard = require('@userdashboard/dashboard')
const organizations = require('../../../../../index.js')

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
    const secretCodeHash = await dashboard.Hash.sha512Hash(req.body['secret-code'], req.alternativesha512, req.alternativeDashboardEncryptionKey)
    const invitationid = `invitation_${await dashboard.UUID.generateID()}`
    const invitationInfo = {
      object: 'invitation',
      organizationid: req.query.organizationid,
      invitationid,
      secretCodeHash,
      created: dashboard.Timestamp.now
    }
    await organizations.Storage.write(`${req.appid}/invitation/${invitationid}`, invitationInfo)
    await organizations.StorageList.add(`${req.appid}/invitations`, invitationid)
    await organizations.StorageList.add(`${req.appid}/account/invitations/${req.account.accountid}`, invitationid)
    await organizations.StorageList.add(`${req.appid}/organization/invitations/${req.query.organizationid}`, invitationid)
    await organizations.Storage.write(`${req.appid}/map/invitationid/organizationid/${invitationid}`, req.query.organizationid)
    req.query.invitationid = invitationid
    return invitationInfo
  }
}
