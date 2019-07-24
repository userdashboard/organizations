const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    req.query = req.query || {}
    let invitationids
    if (req.query.all) {
      invitationids = await dashboard.StorageList.listAll(`${req.appid}/invitations`)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      invitationids = await dashboard.StorageList.list(`${req.appid}/invitations`, offset)
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
