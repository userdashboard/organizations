const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await global.api.user.organizations.Organization._get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    let invitationids
    if (req.query.all) {
      invitationids = await dashboard.StorageList.listAll(`${req.appid}/organization/invitations/${req.query.organizationid}`)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      invitationids = await dashboard.StorageList.list(`${req.appid}/organization/invitations/${req.query.organizationid}`, offset)
    }
    if (!invitationids || !invitationids.length) {
      return null
    }
    const items = []
    for (const invitationid of invitationids) {
      req.query.invitationid = invitationid
      const invitation = await global.api.user.organizations.Invitation._get(req)
      delete (invitation.code)
      items.push(invitation)
    }
    return items
  }
}
