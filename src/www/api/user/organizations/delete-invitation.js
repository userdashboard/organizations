const organizations = require('../../../../../index.js')

module.exports = {
  delete: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    const invitation = await global.api.user.organizations.Invitation.get(req)
    if (!invitation) {
      throw new Error('invalid-invitationid')
    }
    if (invitation.accepted) {
      throw new Error('invalid-invitation')
    }
    req.query.organizationid = invitation.organizationid
    const organization = await global.api.user.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    await organizations.Storage.delete(`${req.appid}/invitation/${req.query.invitationid}`)
    await organizations.StorageList.remove(`${req.appid}/invitations`, req.query.invitationid)
    await organizations.StorageList.remove(`${req.appid}/account/invitations/${req.account.accountid}`, req.query.invitationid)
    await organizations.StorageList.remove(`${req.appid}/organization/invitations/${organization.organizationid}`, req.query.invitationid)
    await organizations.Storage.delete(`${req.appid}/map/invitationid/organizationid/${req.query.invitationid}`)
    return true
  }
}
