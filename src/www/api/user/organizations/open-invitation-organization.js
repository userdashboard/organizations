const dashboard = require('@userappstore/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    let invitation = await dashboard.Storage.read(`${req.appid}/invitation/${req.query.invitationid}`)
    if (!invitation) {
      throw new Error('invalid-invitationid')
    }
    invitation = JSON.parse(invitation)
    if (invitation.object !== 'invitation') {
      throw new Error('invalid-invitationid')
    }
    if (invitation.accepted) {
      throw new Error('invalid-invitation')
    }
    let organization = await dashboard.Storage.read(`${req.appid}/organization/${invitation.organizationid}`)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    organization = JSON.parse(organization)
    if (organization.object !== 'organization') {
      throw new Error('invalid-organizationid')
    }
    return organization
  }
}