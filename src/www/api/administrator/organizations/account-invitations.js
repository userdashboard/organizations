const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    const account = await global.api.administrator.Account.get(req)
    if (!account) {
      throw new Error('invalid-account')
    }
    let invitationids
    if (req.query.all) {
      invitationids = await dashboard.StorageList.listAll(`${req.appid}/account/invitations/${req.query.accountid}`)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      invitationids = await dashboard.StorageList.list(`${req.appid}/account/invitations/${req.query.accountid}`, offset)
    }
    if (!invitationids || !invitationids.length) {
      return null
    }
    const items = []
    for (const invitationid of invitationids) {
      req.query.invitationid = invitationid
      const invitation = await global.api.administrator.organizations.Invitation.get(req)
      delete (invitation.code)
      items.push(invitation)
    }
    return items
  }
}
