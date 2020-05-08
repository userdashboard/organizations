const organizations = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    let invitation = await organizations.Storage.read(`${req.appid}/invitation/${req.query.invitationid}`)
    if (!invitation) {
      throw new Error('invalid-invitationid')
    }
    invitation = JSON.parse(invitation)
    if (invitation.object !== 'invitation') {
      throw new Error('invalid-invitationid')
    }
    req.query.organizationid = invitation.organizationid
    const organization = await global.api.administrator.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    delete (invitation.secretCodeHash)
    return invitation
  }
}
