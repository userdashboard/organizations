const dashboard = require('@userappstore/dashboard')
const Invitation = require('../../../../invitation.js')
const Membership = require('../../../../membership.js')
const Organization = require('../../../../organization.js')

module.exports = {
  get: async (req) => {
    if (!req || !req.account) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    const memberships = await Membership.listByAccount(req.account.accountid)
    if (!memberships || !memberships.length) {
      req.headers['x-memberships'] = ''
      return
    }
    for (const membership of memberships) {
      const organization = await Organization.load(membership.organizationid)
      if (!organization) {
        throw new Error('invalid-organization')
      }
      const owner = await dashboard.Account.load(organization.ownerid)
      if (!owner || owner.deleted) {
        throw new Error('invalid-organization')
      }
      membership.organization = organization
      if (membership.invitationid) {
        const invitation = await Invitation.load(membership.invitationid)
        if (!invitation) {
          throw new Error('invalid-invitation')
        }
        membership.invitation = invitation
      }
    }
    req.headers['x-memberships'] = JSON.stringify(memberships)
  }
}
