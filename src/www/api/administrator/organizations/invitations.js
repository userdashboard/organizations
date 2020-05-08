const organizations = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    req.query = req.query || {}
    let index
    if (req.query.accountid) {
      index = `${req.appid}/account/invitations/${req.query.accountid}`
    } else if (req.query.organizationid) {
      index = `${req.appid}/organization/invitations/${req.query.organizationid}`
    }
    index = index || `${req.appid}/invitations`
    let invitationids
    if (req.query.all) {
      invitationids = await organizations.StorageList.listAll(index)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : global.pageSize
      invitationids = await organizations.StorageList.list(index, offset, limit)
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
