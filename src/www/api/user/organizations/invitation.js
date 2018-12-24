const dashboard = require('@userappstore/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    let invitation = await dashboard.Storage.read(`${req.appid}/${req.query.invitationid}`)
    if (!invitation) {
      throw new Error('invalid-invitationid')
    }
    invitation = JSON.parse(invitation)
    if (invitation.object !== 'invitation') {
      throw new Error('invalid-invitationid')
    }
    req.query.organizationid = invitation.organizationid
    const organization = await global.api.user.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    delete (invitation.code)
    return invitation
  }
}
