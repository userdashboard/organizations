const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await global.api.administrator.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    let invitationids
    if (req.query.all) {
      invitationids = await dashboard.StorageList.listAll(`${req.appid}/organization/invitations/${req.query.organizationid}`)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : global.pageSize
      invitationids = await dashboard.StorageList.list(`${req.appid}/organization/invitations/${req.query.organizationid}`, offset, limit)
    }
    if (!invitationids || !invitationids.length) {
      return null
    }
    const items = []
    for (const invitationid of invitationids) {
      req.query.invitationid = invitationid
      const invitation = await global.api.administrator.organizations.Invitation.get(req)
      items.push(invitation)
    }
    return items
  }
}
