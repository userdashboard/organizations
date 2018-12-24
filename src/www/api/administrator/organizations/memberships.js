const dashboard = require('@userappstore/dashboard')

module.exports = {
  get: async (req) => {
    req.query = req.query || {}
    let membershipids
    if (req.query.all) {
      membershipids = await dashboard.StorageList.listAll(`${req.appid}/memberships`)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      membershipids = await dashboard.StorageList.list(`${req.appid}/memberships`, offset)
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
