const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    req.query = req.query || {}
    let index
    if (req.query.accountid) {
      index = `${req.appid}/account/memberships/${req.query.accountid}`
    } else if (req.query.organizationid) {
      index = `${req.appid}/organization/memberships/${req.query.organizationid}`
    }
    index = index || `${req.appid}/memberships`
    let membershipids
    if (req.query.all) {
      membershipids = await dashboard.StorageList.listAll(index)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : global.pageSize
      membershipids = await dashboard.StorageList.list(index, offset, limit)
    }
    if (!membershipids || !membershipids.length) {
      return null
    }
    const items = []
    for (const membershipid of membershipids) {
      req.query.membershipid = membershipid
      const membership = await global.api.administrator.organizations.Membership.get(req)
      items.push(membership)
    }
    return items
  }
}
