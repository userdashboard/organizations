const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await global.api.user.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    let membershipids
    if (req.query.all) {
      membershipids = await dashboard.StorageList.listAll(`${req.appid}/organization/memberships/${req.query.organizationid}`)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : global.pageSize
      membershipids = await dashboard.StorageList.list(`${req.appid}/organization/memberships/${req.query.organizationid}`, offset, limit)
    }
    if (!membershipids || !membershipids.length) {
      return null
    }
    const items = []
    for (const membershipid of membershipids) {
      req.query.membershipid = membershipid
      const membership = await global.api.user.organizations.Membership.get(req)
      items.push(membership)
    }
    return items
  }
}
