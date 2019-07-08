const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    let membershipids
    if (req.query.all) {
      membershipids = await dashboard.StorageList.listAll(`${req.appid}/organization/memberships/${req.query.organizationid}`)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      membershipids = await dashboard.StorageList.list(`${req.appid}/organization/memberships/${req.query.organizationid}`, offset)
    }
    if (!membershipids || !membershipids.length) {
      return null
    }
    const items = []
    for (const membershipid of membershipids) {
      req.query.membershipid = membershipid
      const membership = await global.api.administrator.organizations.Membership._get(req)
      items.push(membership)
    }
    return items
  }
}
