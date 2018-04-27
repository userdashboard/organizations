const dashboard = require('@userappstore/dashboard')
const Invitation = require('../../../../invitation.js')
const Organization = require('../../../../organization.js')

module.exports = {
  get: async (req) => {
    if (!req || !req.account || !req.account.administrator) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    const invitation = await Invitation.load(req.query.invitationid)
    if (!invitation) {
      throw new Error('invalid-invitation')
    }
    const organization = await Organization.load(invitation.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    const owner = await dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }
    delete (invitation.code)
    return invitation
  }
}
