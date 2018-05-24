const dashboard = require('@userappstore/dashboard')
const Invitation = require('../../../../invitation.js')
const Organization = require('../../../../organization.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    const invitation = await Invitation.load(req.query.invitationid)
    if (!invitation) {
      throw new Error('invalid-invitationid')
    }
    const organization = await Organization.load(invitation.organizationid)
    if (organization.ownerid !== req.account.accountid) {
      req.query.accountid = req.account.accountid
      const memberships = await global.api.user.organizations.AccountMemberships.get(req)
      let found = false
      if (memberships && memberships.length) {
        for (const membership of memberships) {
          if (membership.organizationid === organization.organizationid) {
            found = true
            break
          }
        }
      }
      if (found) {
        throw new Error('invalid-account')
      }
    }
    const owner = await dashboard.Account.load(organization.ownerid)
    if (!owner || owner.deleted) {
      throw new Error('invalid-organization')
    }

    delete (invitation.code)
    return { invitation, organization }
  }
}
