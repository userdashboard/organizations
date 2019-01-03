const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
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
    req.data = { invitation, organization }
  },
  delete: async (req) => {
    await dashboard.Storage.deleteFile(`${req.appid}/invitation/${req.query.invitationid}`)
    await dashboard.StorageList.remove(`${req.appid}/invitations`, req.query.invitationid)
    await dashboard.StorageList.remove(`${req.appid}/account/invitations/${req.account.accountid}`, req.query.invitationid)
    await dashboard.StorageList.remove(`${req.appid}/organization/invitations/${req.data.organization.organizationid}`, req.query.invitationid)
    await dashboard.Storage.deleteFile(`${req.appid}/map/invitationid/organizationid/${req.query.invitationid}`)
    req.success = true
  }
}
